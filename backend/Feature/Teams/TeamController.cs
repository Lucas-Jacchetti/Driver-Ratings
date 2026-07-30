using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Teams;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _service;

    public TeamsController(ITeamService service)
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
        var team = await _service.CreateAsync(request.Name);

        if (team == null)
        {
            return Conflict(new { error = "A team with this name already exists." });
        }

        return Created($"/api/teams/{team.Id}",TeamMapper.ToResponse(team));
    }
}