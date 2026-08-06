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
            return Result<DriverRaceResult>.Failure("This driver already has a team assigned for this season.");
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