using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Races.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.Races;

public class RaceService : IRaceService
{
    private readonly ApplicationDbContext _dbContext;

    public RaceService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Race?> CreateAsync(Race race)
    {
        var seasonExists = await _dbContext.Seasons.AnyAsync(s => s.Id == race.SeasonId);
        if (!seasonExists)
        {
            return null;
        }

        _dbContext.Races.Add(race);

        var driverSeasonIds = await _dbContext.DriverSeasons
            .Where(ds => ds.SeasonId == race.SeasonId)
            .Select(ds => ds.Id)
            .ToListAsync();

        foreach (var driverSeasonId in driverSeasonIds)
        {
            _dbContext.DriverRaceResults.Add(new DriverRaceResult
            {
                DriverSeasonId = driverSeasonId,
                RaceId = race.Id,
                StartingPosition = 0,
                FinishingPosition = 0,
                Context = string.Empty
            });
        }

        await _dbContext.SaveChangesAsync();

        return await GetByIdAsync(race.Id);
    }

    public async Task<Race?> DeleteAsync(Guid raceId)
    {
        var race = await _dbContext.Races.FindAsync(raceId);
        if (race is null)
        {
            return null;
        }

        _dbContext.Races.Remove(race);
        await _dbContext.SaveChangesAsync();

        return race;
    }

    public async Task<ICollection<Race>> GetAllAsync()
    {
        return await _dbContext.Races
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<Race?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Races
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}