using backend.Data;
using backend.Domain.Entities;
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

    public async Task<Team?> CreateAsync(string name)
    {
        var alreadyExists = await _dbContext.Teams.AnyAsync(t => t.Name == name);
        if (alreadyExists)
        {
            return null;
        }

        var team = TeamMapper.ToDomain(name);

        _dbContext.Teams.Add(team);
        await _dbContext.SaveChangesAsync();

        return team;
    }
}