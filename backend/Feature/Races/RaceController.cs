using backend.Domain.Interfaces;
using backend.Feature.Races.DataManipulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Races;

[ApiController]
[Route("api/[controller]")]
public class RaceController : ControllerBase
{
    private readonly IRaceService _service;

    public RaceController(IRaceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var races = await _service.GetAllAsync();
        return Ok(races.Select(RaceMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var race = await _service.GetByIdAsync(id);

        if (race is null)
        {
            return NotFound();
        }

        return Ok(RaceMapper.ToResponse(race));
    }

    [Authorize] //admin
    [HttpPost]
    public async Task<IActionResult> Create(RaceCreationDTO request)
    {
        var race = RaceMapper.ToDomain(request);
        var raceCreated = await _service.CreateAsync(race);

        if (raceCreated is null)
        {
            return BadRequest(new { error = "Season not found" });
        }

        return CreatedAtAction(nameof(GetById), new { id = raceCreated.Id }, RaceMapper.ToResponse(raceCreated));
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent()
    {
        var race = await _service.GetCurrentAsync();
        if (race is null) return NotFound();
        return Ok(RaceMapper.ToResponse(race));
    }

    [Authorize] //admin
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var race = await _service.DeleteAsync(id);

        if (race is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}