using System.Security.Claims;
using backend.Domain.Interfaces;
using backend.Feature.Groups.Communities.DataManipulation;
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
    public async Task<IActionResult> GetAll()
    {
        var community = await _service.GetAllAsync();
        return Ok(community.Select(CommunityMapper.ToResponse).ToList());
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
        return CreatedAtAction(nameof(GetById), response);
    }

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