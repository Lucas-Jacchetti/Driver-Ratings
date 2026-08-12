using backend.Domain.Interfaces;
using backend.Feature.DriverRaceResults.DataManipulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.DriverRaceResults;

[ApiController]
[Route("api/[controller]")]
public class DriverRaceResultController : ControllerBase
{
    private readonly IDriverRaceResultService _service;

    public DriverRaceResultController(IDriverRaceResultService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var driverRaceResult = await _service.GetAllAsync();
        return Ok(driverRaceResult.Select(DriverRaceResultMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var driverRaceResult = await _service.GetByIdAsync(id);

        if (driverRaceResult is null)
        {
            return NotFound();
        }

        return Ok(DriverRaceResultMapper.ToResponse(driverRaceResult));
    }

    [HttpGet("race/{raceId:guid}")]
    public async Task<IActionResult> GetByRaceId(Guid raceId)
    {
        var driverRaceResult = await _service.GetByRaceIdAsync(raceId);

        if (driverRaceResult is null)
        {
            return NotFound();
        }

        return Ok(DriverRaceResultMapper.ToResponse(driverRaceResult));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(DriverRaceResultCreationDTO request)
    {
        var driverRaceResult = DriverRaceResultMapper.ToDomain(request);
        var result = await _service.CreateAsync(driverRaceResult);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = DriverRaceResultMapper.ToResponse(result.Value!);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [Authorize]
    [HttpPut("race/{raceId:guid}")]
    public async Task<IActionResult> UpdateRaceResults(Guid raceId, DriverRaceResultSubmissionRequest request)
    {
        var result = await _service.UpdateDriverRaceResultsAsync(raceId, request);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = result.Value!
            .Select(DriverRaceResultMapper.ToResponse)
            .ToList();

        return Ok(response);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var driverRaceResult = await _service.DeleteAsync(id);

        if (driverRaceResult is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}