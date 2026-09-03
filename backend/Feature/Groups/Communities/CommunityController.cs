using System.Security.Claims;
using backend.Domain.Interfaces;
using backend.Feature.Groups.Communities.DataManipulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Groups.Communities;

[ApiController]
[Route("api/[controller]")]
public class CommunityController : ControllerBase
{
    private readonly ICommunityService _service;

    public CommunityController(ICommunityService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _service.GetAllAsync(page, pageSize);

        return Ok(new
        {
            items = result.Items.Select(CommunityMapper.ToResponse).ToList(),
            totalCount = result.TotalCount,
            page = result.Page,
            pageSize = result.PageSize,
            totalPages = result.TotalPages
        });
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMy([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.GetMy(page, pageSize, userId);

        return Ok(new
        {
            items = result.Items.Select(CommunityMapper.ToResponse).ToList(),
            totalCount = result.TotalCount,
            page = result.Page,
            pageSize = result.PageSize,
            totalPages = result.TotalPages
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var community = await _service.GetByIdAsync(id);

        if (community is null)
        {
            return NotFound();
        }

        return Ok(CommunityMapper.ToResponse(community));
    }

    [Authorize]
    [HttpGet("by-code/{accessCode}")]
    public async Task<IActionResult> GetByAccessCode(string accessCode)
    {
        var community = await _service.GetByAccessCodeAsync(accessCode);

        if (community is null)
        {
            return NotFound(new { error = "Invalid access code." });
        }

        return Ok(CommunityMapper.ToResponse(community));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CommunityCreationDTO request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var community = CommunityMapper.ToDomain(request, userId);
        var result = await _service.CreateAsync(community);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = CommunityMapper.ToResponse(result.Value!);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [Authorize]
    [HttpPatch("{communityId:guid}")]
    public async Task<IActionResult> Update(Guid communityId, CommunityUpdateRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var updatedCommunity = await _service.UpdateAsync(userId, communityId, request);

        if (updatedCommunity is null)
        {
            return NotFound();
        }
        var response = CommunityMapper.ToResponse(updatedCommunity.Value!);
        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var community = await _service.DeleteAsync(id);

        if (community is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}