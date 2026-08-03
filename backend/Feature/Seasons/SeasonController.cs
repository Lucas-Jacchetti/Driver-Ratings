using backend.Domain.Interfaces;
using backend.Feature.Seasons.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Seasons;

[ApiController]
[Route("api/[controller]")]
public class SeasonController : ControllerBase
{
    private readonly ISeasonService _service;

    public SeasonController(ISeasonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var seasons = await _service.GetAllAsync();
        return Ok(seasons.Select(SeasonMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var season = await _service.GetByIdAsync(id);

        if (season is null)
        {
            return NotFound();
        }

        return Ok(SeasonMapper.ToResponse(season));
    }

    [HttpPost]
    public async Task<IActionResult> Create(SeasonCreationDTO request)
    {
        var season = SeasonMapper.ToDomain(request);
        var seasonCreated = await _service.CreateAsync(season);

        if (seasonCreated is null)
        {
            return BadRequest(new { error = "Invalid season year" });
        }

        return CreatedAtAction(nameof(GetById), SeasonMapper.ToResponse(seasonCreated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var driver = await _service.DeleteAsync(id);

        if (driver is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}