using System.Security.Claims;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Domain.ValueObjects;
using backend.Feature.Ratings.Contracts;
using backend.Feature.Ratings.DataManipulation;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize] //admin
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ratings = await _service.GetAllAsync();
        return Ok(ratings.Select(RatingMapper.ToResponse).ToList());
    }

    [Authorize] //admin
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

    [Authorize]
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

    [Authorize]
    [HttpPost("race")]
    public async Task<IActionResult> RaceRatings(RaceRatingCreationDTO request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var ratings = request.Ratings
            .Select(r => new Rating{
                UserId = userId,
                DriverRaceResultId = r.DriverRaceResultId,
                Score = Score.Create(r.Score)
            })
            .ToList();

        var submission = new RaceRatingSubmission
        {
            UserId = userId,
            RaceId = request.RaceId,
            Ratings = ratings
        };

        var result = await _service.CreateRaceRatingsAsync(submission);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = result.Value!
            .Select(RatingMapper.ToResponse)
            .ToList();

        return Ok(response);
    }

    [Authorize]
    [HttpPut("race/update")]
    public async Task<IActionResult> UpdateRaceRatings(RaceRatingCreationDTO request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var ratings = request.Ratings
            .Select(r => new Rating{
                UserId = userId,
                DriverRaceResultId = r.DriverRaceResultId,
                Score = Score.Create(r.Score)
            })
            .ToList();

        var submission = new RaceRatingSubmission
        {
            UserId = userId,
            RaceId = request.RaceId,
            Ratings = ratings
        };

        var result = await _service.UpdateRaceRatingsAsync(submission);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        var response = result.Value!
            .Select(RatingMapper.ToResponse)
            .ToList();

        return Ok(response);
    }

    // [HttpGet("season/{seasonId:guid}")]
    // public async Task<IActionResult> GetSeasonRatings(Guid seasonId, [FromQuery] int year)
    // {
    //     var ratings = await _service.GetSeasonRatingsAsync(seasonId, year);

    //     return Ok(ratings);
    // }

    // [HttpGet("race/{raceId:guid}")]
    // public async Task<IActionResult> GetRaceRatings(Guid raceId, [FromQuery] int year)
    // {
    //     var ratings = await _service.GetRaceRatingsAsync(raceId, year);

    //     return Ok(ratings);
    // }

    [HttpGet("global")]
    public async Task<IActionResult> GetGlobalRatings([FromQuery] int year, [FromQuery] Guid? raceId)
    {
        var ratings = await _service.GetGlobalRatingsAsync(year, raceId);

        return Ok(ratings);
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<IActionResult> GetUserRaceRatings([FromQuery] int year, [FromQuery] Guid? raceId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ratings = await _service.GetUserRatingsAsync(year, userId, raceId);

        return Ok(ratings);
    }

    // [Authorize]
    // [HttpGet("season/user/{seasonId:guid}")]
    // public async Task<IActionResult> GetUserRatings(Guid seasonId, [FromQuery] int year)
    // {
    //     var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    //     var ratings = await _service.GetUserRatingsAsync(seasonId, userId, year);

    //     return Ok(ratings);
    // }

    // [Authorize]
    // [HttpGet("race/user/{raceId:guid}")]
    // public async Task<IActionResult> GetUserRaceRatings(Guid raceId, [FromQuery] int year)
    // {
    //     var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    //     var ratings = await _service.GetUserRaceRatingsAsync(raceId, userId, year);

    //     return Ok(ratings);
    // }

    [Authorize] //admin
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