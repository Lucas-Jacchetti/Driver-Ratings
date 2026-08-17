using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Ratings.Contracts;
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

        var driverRaceResult = await _dbContext.DriverRaceResults
            .Include(drr => drr.Race)
            .FirstOrDefaultAsync(drr => drr.Id == rating.DriverRaceResultId);

        var ratingsOpenAt = driverRaceResult!.Race.Date.AddHours(Race.DurationHours);
        if (DateTime.UtcNow < ratingsOpenAt)
        {
            return Result<Rating>.Failure($"Ratings for this race open at {ratingsOpenAt:u}.");
        }

        var alreadyRated = await _dbContext.Ratings
            .AnyAsync(r => r.UserId == rating.UserId && r.DriverRaceResultId == rating.DriverRaceResultId);
        if (alreadyRated)
        {
            return Result<Rating>.Failure("You already rated this driver for this race.");
        }

        _dbContext.Ratings.Add(rating);
        await _dbContext.SaveChangesAsync();

        var created = await GetByIdAsync(rating.Id);
        return Result<Rating>.Success(created!);
    }

    public async Task<Result<ICollection<Rating>>> CreateRaceRatingsAsync(RaceRatingSubmission submission)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var driverRaceResultIds = submission.Ratings.Select(r => r.DriverRaceResultId)
                .ToList();

            var driverRaceResults = await _dbContext.DriverRaceResults.Where(drr => driverRaceResultIds.Contains(drr.Id))
                .ToListAsync();

            var race = await _dbContext.Races.FirstOrDefaultAsync(r => r.Id == submission.RaceId);
            if (race is null)
            {
                return Result<ICollection<Rating>>.Failure("Race not found.");
            }

            var ratingsOpenAt = race.Date.AddHours(Race.DurationHours);
            if (DateTime.UtcNow < ratingsOpenAt)
            {
                return Result<ICollection<Rating>>.Failure($"Ratings for this race open at {ratingsOpenAt:u}.");
            }

            if (driverRaceResults.Count != driverRaceResultIds.Count)
            {
                return Result<ICollection<Rating>>.Failure("One or more race results were not found.");
            }

            var alreadyRated = await _dbContext.Ratings.AnyAsync(r => r.UserId == submission.UserId && r.DriverRaceResult.RaceId == submission.RaceId);
            if (alreadyRated)
            {
                return Result<ICollection<Rating>>.Failure("Race already rated.");
            }

            var validIds = await _dbContext.DriverRaceResults
                .Where(drr => drr.RaceId == submission.RaceId)
                .Select(drr => drr.Id)
                .ToHashSetAsync();

            foreach (var rating in submission.Ratings)
            {
                if (!validIds.Contains(rating.DriverRaceResultId))
                {
                    return Result<ICollection<Rating>>.Failure("Invalid driver race result.");
                }
            }

            _dbContext.Ratings.AddRange(submission.Ratings);

            await _dbContext.SaveChangesAsync();

            var savedRatings = await _dbContext.Ratings
                .Where(r => submission.Ratings
                    .Select(sr => sr.Id)
                    .Contains(r.Id))
                .IncludeForMapping()
                .ToListAsync();

            await transaction.CommitAsync();

            return Result<ICollection<Rating>>
                .Success(savedRatings);
        }
        catch
        {
            await transaction.RollbackAsync();

            return Result<ICollection<Rating>>
                .Failure("An error occurred while saving the ratings.");
        }
    }

    public async Task<Result<ICollection<Rating>>> UpdateRaceRatingsAsync(RaceRatingSubmission submission)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var race = await _dbContext.Races
                .FirstOrDefaultAsync(r => r.Id == submission.RaceId);

            if (race is null)
                return Result<ICollection<Rating>>.Failure("Race not found.");

            var ratingsOpenAt = race.Date.AddHours(Race.DurationHours);

            if (DateTime.UtcNow < ratingsOpenAt)
            {
                return Result<ICollection<Rating>>.Failure(
                    $"Ratings for this race open at {ratingsOpenAt:u}.");
            }

            var driverRaceResultIds = submission.Ratings
                .Select(r => r.DriverRaceResultId)
                .ToList();

            var validIds = await _dbContext.DriverRaceResults
                .Where(drr =>
                    drr.RaceId == submission.RaceId &&
                    driverRaceResultIds.Contains(drr.Id))
                .Select(drr => drr.Id)
                .ToHashSetAsync();

            if (validIds.Count != driverRaceResultIds.Count)
            {
                return Result<ICollection<Rating>>
                    .Failure("One or more driver race results are invalid.");
            }

            var existingRatings = await _dbContext.Ratings
                .Where(r =>
                    r.UserId == submission.UserId &&
                    driverRaceResultIds.Contains(r.DriverRaceResultId))
                .IncludeForMapping()
                .ToListAsync();

            if (existingRatings.Count != driverRaceResultIds.Count)
            {
                return Result<ICollection<Rating>>
                    .Failure("One or more ratings were not found.");
            }

            foreach (var submittedRating in submission.Ratings)
            {
                var existingRating = existingRatings.First(
                    r => r.DriverRaceResultId == submittedRating.DriverRaceResultId);

                existingRating.Score = submittedRating.Score;
            }

            await _dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return Result<ICollection<Rating>>
                .Success(existingRatings);
        }
        catch
        {
            await transaction.RollbackAsync();

            return Result<ICollection<Rating>>
                .Failure("An error occurred while updating the ratings.");
        }
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

    public async Task<ICollection<DriverSeasonRating>> GetRaceRatingsAsync(Guid raceId)
    {
        return await _dbContext.Ratings
            .Where(r => r.DriverRaceResult.RaceId == raceId)
            .GroupBy(r => new {r.DriverRaceResult.DriverSeasonId, DriverName = r.DriverRaceResult.DriverSeason.Driver.Name})
            .OrderByDescending(g => g.Average(r => r.Score.Value))
            .Select(g => new DriverSeasonRating(
                g.Key.DriverSeasonId,
                g.Key.DriverName,
                Math.Round(g.Average(r => r.Score.Value), 2)
            ))
            .ToListAsync();
    }

    public async Task<ICollection<DriverSeasonRating>> GetSeasonRatingsAsync(Guid seasonId)
    {
        return await _dbContext.Ratings
            .Where(r => r.DriverRaceResult.DriverSeason.SeasonId == seasonId)
            .GroupBy(r => new {r.DriverRaceResult.DriverSeasonId, DriverName = r.DriverRaceResult.DriverSeason.Driver.Name})
            .OrderByDescending(g => g.Average(r => r.Score.Value))
            .Select(g => new DriverSeasonRating(
                g.Key.DriverSeasonId,
                g.Key.DriverName,
                Math.Round(g.Average(r => r.Score.Value), 2)
            ))
            .ToListAsync();
    }

    public async Task<ICollection<DriverSeasonRating>> GetUserRaceRatingsAsync(Guid raceId, Guid userId)
    {
        return await _dbContext.Ratings
            .Where(r => r.DriverRaceResult.RaceId == raceId && r.UserId == userId)
            .GroupBy(r => new {r.DriverRaceResult.DriverSeasonId, DriverName = r.DriverRaceResult.DriverSeason.Driver.Name})
            .OrderByDescending(g => g.Average(r => r.Score.Value))
            .Select(g => new DriverSeasonRating(
                g.Key.DriverSeasonId,
                g.Key.DriverName,
                Math.Round(g.Average(r => r.Score.Value), 2)
            ))
            .ToListAsync();
    }

    public async Task<ICollection<DriverSeasonRating>> GetUserRatingsAsync(Guid seasonId, Guid userId)
    {
        return await _dbContext.Ratings
            .Where(r => r.DriverRaceResult.DriverSeason.SeasonId == seasonId && r.UserId == userId)
            .GroupBy(r => new {r.DriverRaceResult.DriverSeasonId, DriverName = r.DriverRaceResult.DriverSeason.Driver.Name})
            .OrderByDescending(g => g.Average(r => r.Score.Value))
            .Select(g => new DriverSeasonRating(
                g.Key.DriverSeasonId,
                g.Key.DriverName,
                Math.Round(g.Average(r => r.Score.Value), 2)
            ))
            .ToListAsync();
    }
}