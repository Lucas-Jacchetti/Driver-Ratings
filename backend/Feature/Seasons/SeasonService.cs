using backend.Data;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Seasons.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.Seasons;

public class SeasonService : ISeasonService
{
    private readonly ApplicationDbContext _dbContext;

    public SeasonService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Season?> CreateAsync(Season season)
    {
        _dbContext.Seasons.Add(season);
        await _dbContext.SaveChangesAsync();

        return await GetByIdAsync(season.Id);
    }

    public async Task<Season?> DeleteAsync(Guid seasonId)
    {
        var season = await _dbContext.Seasons.FindAsync(seasonId);
        if (season is null)
        {
            return null;
        }

        _dbContext.Seasons.Remove(season);
        await _dbContext.SaveChangesAsync();

        return season;
    }

    public async Task<ICollection<Season>> GetAllAsync()
    {
        return await _dbContext.Seasons
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<Season?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Seasons
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}