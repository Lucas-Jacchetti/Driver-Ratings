using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.DriverSeasons.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.DriverSeasons;

public class DriverSeasonService : IDriverSeasonService
{
    private readonly ApplicationDbContext _dbContext;

    public DriverSeasonService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Result<DriverSeason>> CreateAsync(DriverSeason driverSeason)
    {
        var driverExists = await _dbContext.Drivers.AnyAsync(d => d.Id == driverSeason.DriverId);
        if (!driverExists)
        {
            return Result<DriverSeason>.Failure("Driver not found.");
        }

        var teamExists = await _dbContext.Teams.AnyAsync(t => t.Id == driverSeason.TeamId);
        if (!teamExists)
        {
            return Result<DriverSeason>.Failure("Team not found.");
        }

        var seasonExists = await _dbContext.Seasons.AnyAsync(s => s.Id == driverSeason.SeasonId);
        if (!seasonExists)
        {
            return Result<DriverSeason>.Failure("Season not found.");
        }

        var alreadyExists = await _dbContext.DriverSeasons
            .AnyAsync(ds => ds.DriverId == driverSeason.DriverId && ds.SeasonId == driverSeason.SeasonId);
        if (alreadyExists)
        {
            return Result<DriverSeason>.Failure("This driver already has a team assigned for this season.");
        }

        _dbContext.DriverSeasons.Add(driverSeason);
        await _dbContext.SaveChangesAsync();

        var created = await GetByIdAsync(driverSeason.Id);
        return Result<DriverSeason>.Success(created!);
    }

    public async Task<DriverSeason?> DeleteAsync(Guid driverSeasonId)
    {
        var driverSeason = await _dbContext.DriverSeasons.FindAsync(driverSeasonId);
        if (driverSeason is null)
        {
            return null;
        }

        _dbContext.DriverSeasons.Remove(driverSeason);
        await _dbContext.SaveChangesAsync();

        return driverSeason;
    }

    public async Task<ICollection<DriverSeason>> GetAllAsync()
    {
        return await _dbContext.DriverSeasons
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<DriverSeason?> GetByIdAsync(Guid id)
    {
        return await _dbContext.DriverSeasons
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}