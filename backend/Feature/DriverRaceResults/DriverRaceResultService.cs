using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.DriverRaceResults.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.DriverRaceResults;

public class DriverRaceResultService : IDriverRaceResultService
{
    private readonly ApplicationDbContext _dbContext;

    public DriverRaceResultService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Result<ICollection<DriverRaceResult>>> UpdateDriverRaceResultsAsync(Guid raceId, DriverRaceResultSubmissionRequest submission)
    {
        await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {   
            var raceExists = await _dbContext.Races
                .AnyAsync(r => r.Id == raceId);

            if (!raceExists)
            {
                return Result<ICollection<DriverRaceResult>>
                    .Failure("Race not found.");
            }

            var resultIds = submission.Results
                .Select(r => r.DriverRaceResultId)
                .ToList();

            var driverRaceResults = await _dbContext.DriverRaceResults
                .Where(dr => resultIds.Contains(dr.Id) && dr.RaceId == raceId)
                .ToListAsync();
            
            if (driverRaceResults.Count != resultIds.Count)
            {
                return Result<ICollection<DriverRaceResult>>.Failure("One or more driver race results were not found, or the results belong to a different race.");
            }

            foreach (var result in submission.Results)            {
                var driverRaceResult = driverRaceResults
                    .First(r => r.Id == result.DriverRaceResultId);

                driverRaceResult.StartingPosition = result.StartingPosition;
                driverRaceResult.FinishingPosition = result.FinishingPosition;
                driverRaceResult.Context = result.Context;
            }

            await _dbContext.SaveChangesAsync();

            var savedDriverRaceResults = await _dbContext.DriverRaceResults
                .Where(r => resultIds.Contains(r.Id))
                .IncludeForMapping()
                .ToListAsync();

            await transaction.CommitAsync();

            return Result<ICollection<DriverRaceResult>>
                .Success(savedDriverRaceResults);
            }
        catch
        {
            await transaction.RollbackAsync();

            return Result<ICollection<DriverRaceResult>>.Failure("An error occurred while saving the race results.");
        }
    }

    public async Task<Result<DriverRaceResult>> CreateAsync(DriverRaceResult driverRaceResult)
    {
        var raceExists = await _dbContext.Races.AnyAsync(s => s.Id == driverRaceResult.RaceId);
        if (!raceExists)
        {
            return Result<DriverRaceResult>.Failure("Race not found.");
        }

        var driverSeasonExists = await _dbContext.DriverSeasons.AnyAsync(ds => ds.Id == driverRaceResult.DriverSeasonId);
        if (!driverSeasonExists)
        {
            return Result<DriverRaceResult>.Failure("This driver doesn't exists in this season.");
        }

        _dbContext.DriverRaceResults.Add(driverRaceResult);
        await _dbContext.SaveChangesAsync();

        var created = await GetByIdAsync(driverRaceResult.Id);
        return Result<DriverRaceResult>.Success(created!);
    }

    public async Task<DriverRaceResult?> DeleteAsync(Guid driverRaceResultId)
    {
        var driverRaceResult = await _dbContext.DriverRaceResults.FindAsync(driverRaceResultId);
        if (driverRaceResult is null)
        {
            return null;
        }

        _dbContext.DriverRaceResults.Remove(driverRaceResult);
        await _dbContext.SaveChangesAsync();

        return driverRaceResult;
    }

    public async Task<ICollection<DriverRaceResult>> GetAllAsync()
    {
        return await _dbContext.DriverRaceResults
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<DriverRaceResult?> GetByIdAsync(Guid id)
    {
        return await _dbContext.DriverRaceResults
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}