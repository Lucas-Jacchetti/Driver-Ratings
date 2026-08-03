using backend.Domain.Interfaces;
using backend.Feature.Teams.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Teams;

[ApiController]
[Route("api/[controller]")]
public class TeamController : ControllerBase
{
    private readonly ITeamService _service;

    public TeamController(ITeamService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var teams = await _service.GetAllAsync();
        return Ok(TeamMapper.ToResponse(teams));
    }

    [HttpPost]
    public async Task<IActionResult> Create(TeamCreationDTO request)
    {
        var team = TeamMapper.ToDomain(request);
        var teamCreated = await _service.CreateAsync(team);

        if (teamCreated == null)
        {
            return Conflict(new { error = "A team with this name already exists." });
        }

        return CreatedAtAction(nameof(GetById),TeamMapper.ToResponse(teamCreated));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var team = await _service.GetByIdAsync(id);

        if (team is null)
        {
            return NotFound();
        }

        return Ok(TeamMapper.ToResponse(team));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var team = await _service.DeleteAsync(id);

        if (team is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}