using System.Security.Claims;
using backend.Domain.Interfaces;
using backend.Feature.Ratings.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Ratings;

[ApiController]
[Route("api/[controller]")]
public class RatingController : ControllerBase
{
    private readonly IRatingService _service;

    public RatingController(IRatingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ratings = await _service.GetAllAsync();
        return Ok(ratings.Select(RatingMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var rating = await _service.GetByIdAsync(id);

        if (rating is null)
        {
            return NotFound();
        }

        return Ok(RatingMapper.ToResponse(rating));
    }

    [HttpPost]
    public async Task<IActionResult> Create(RatingCreationDTO request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var rating = RatingMapper.ToDomain(request, userId);
        var result = await _service.CreateAsync(rating);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = RatingMapper.ToResponse(result.Value!);
        return CreatedAtAction(nameof(GetById),new { id = response.Id }, response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var rating = await _service.DeleteAsync(id);

        if (rating is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}