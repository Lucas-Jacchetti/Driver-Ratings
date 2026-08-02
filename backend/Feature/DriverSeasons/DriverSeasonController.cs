using backend.Domain.Interfaces;
using backend.Feature.DriverSeasons.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.DriverSeasons;

[ApiController]
[Route("api/[controller]")]
public class DriverSeasonController : ControllerBase
{
    private readonly IDriverSeasonService _service;

    public DriverSeasonController(IDriverSeasonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var driverSeasons = await _service.GetAllAsync();
        return Ok(driverSeasons.Select(DriverSeasonMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var driverSeason = await _service.GetByIdAsync(id);

        if (driverSeason is null)
        {
            return NotFound();
        }

        return Ok(DriverSeasonMapper.ToResponse(driverSeason));
    }

    [HttpPost]
    public async Task<IActionResult> Create(DriverSeasonCreationDTO request)
    {
        var driverSeason = DriverSeasonMapper.ToDomain(request);
        var result = await _service.CreateAsync(driverSeason);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = DriverSeasonMapper.ToResponse(result.Value!);
        return CreatedAtAction(nameof(GetById), response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var driverSeason = await _service.DeleteAsync(id);

        if (driverSeason is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}