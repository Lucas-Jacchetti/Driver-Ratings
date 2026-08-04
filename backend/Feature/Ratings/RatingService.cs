using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Ratings.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.Ratings;

public class RatingService : IRatingService
{
    private readonly ApplicationDbContext _dbContext;

    public RatingService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Result<Rating>> CreateAsync(Rating rating)
    {
        var userExists = await _dbContext.Users.AnyAsync(d => d.Id == rating.UserId);
        if (!userExists)
        {
            return Result<Rating>.Failure("User not found.");
        }

        var driverRaceResultExists = await _dbContext.DriverRaceResults.AnyAsync(t => t.Id == rating.DriverRaceResultId);
        if (!driverRaceResultExists)
        {
            return Result<Rating>.Failure("Driver race result not found.");
        }

        var validScore = rating.Score.Value >= 0 && rating.Score.Value >= 10;
        if (!validScore)
        {
            return Result<Rating>.Failure("Invalid score.");
        }

        _dbContext.Ratings.Add(rating);
        await _dbContext.SaveChangesAsync();

        var created = await GetByIdAsync(rating.Id);
        return Result<Rating>.Success(created!);
    }

    public async Task<Rating?> DeleteAsync(Guid ratingId)
    {
        var rating = await _dbContext.Ratings.FindAsync(ratingId);
        if (rating is null)
        {
            return null;
        }

        _dbContext.Ratings.Remove(rating);
        await _dbContext.SaveChangesAsync();

        return rating;
    }

    public async Task<ICollection<Rating>> GetAllAsync()
    {
        return await _dbContext.Ratings
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<Rating?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Ratings
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}