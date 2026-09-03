using System.Security.Claims;
using backend.Domain.Interfaces;
using backend.Feature.Groups.CommunityMembers.DataManipulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Groups.CommunityMembers;

[ApiController]
[Route("api/[controller]")]
public class CommunityMemberController : ControllerBase
{
    private readonly ICommunityMemberService _service;

    public CommunityMemberController(ICommunityMemberService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var communityMember = await _service.GetAllAsync();
        return Ok(communityMember.Select(CommunityMemberMapper.ToResponse).ToList());
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var communityMember = await _service.GetByIdAsync(id);

        if (communityMember is null)
        {
            return NotFound();
        }

        return Ok(CommunityMemberMapper.ToResponse(communityMember));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CommunityMemberCreationDTO request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var communityMember = CommunityMemberMapper.ToDomain(request, userId);
        var result = await _service.CreateAsync(communityMember, request.AccessToken);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = CommunityMemberMapper.ToResponse(result.Value!);
        return CreatedAtAction(nameof(GetById), response);
    }

    [Authorize]
    [HttpDelete("{communityId:guid}/members/me")]
    public async Task<IActionResult> Leave(Guid communityId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var communityMember = await _service.LeaveAsync(communityId, userId);

        if (communityMember is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}