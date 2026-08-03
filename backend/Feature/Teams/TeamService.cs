using backend.Data;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Teams.DataManipulation;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Teams;

public class TeamService : ITeamService
{
    private readonly ApplicationDbContext _dbContext;

    public TeamService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<ICollection<Team>> GetAllAsync()
    {
        return await _dbContext.Teams
            .OrderBy(t => t.Name)
            .ToListAsync();
    }

    public async Task<Team?> CreateAsync(Team team)
    {
        var alreadyExists = await _dbContext.Teams.AnyAsync(t => t.Name == team.Name);
        if (alreadyExists)
        {
            return null;
        }

        _dbContext.Teams.Add(team);
        await _dbContext.SaveChangesAsync();

        return team;
    }

    public async Task<Team?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Teams
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Team?> DeleteAsync(Guid teamId)
    {
        var team = await _dbContext.Teams.FindAsync(teamId);
        if (team is null)
        {
            return null;
        }

        _dbContext.Teams.Remove(team);
        await _dbContext.SaveChangesAsync();

        return team;
    }
}