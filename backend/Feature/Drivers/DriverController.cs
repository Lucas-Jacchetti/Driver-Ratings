using backend.Domain.Interfaces;
using backend.Feature.Drivers.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Drivers;

[ApiController]
[Route("api/[controller]")]
public class DriverController : ControllerBase
{
    private readonly IDriverService _service;

    public DriverController(IDriverService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var drivers = await _service.GetAllAsync();
        return Ok(drivers.Select(DriverMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var race = await _service.GetByIdAsync(id);

        if (race is null)
        {
            return NotFound();
        }

        return Ok(DriverMapper.ToResponse(race));
    }

    [HttpPost]
    public async Task<IActionResult> Create(DriverCreationDTO request)
    {
        var driver = DriverMapper.ToDomain(request);
        var driverCreated = await _service.CreateAsync(driver);

        if (driverCreated is null)
        {
            return BadRequest(new { error = "Invalid driver name" });
        }

        return CreatedAtAction(nameof(GetById), DriverMapper.ToResponse(driverCreated));
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