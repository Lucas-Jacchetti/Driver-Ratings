using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Groups.Communities.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.Groups.Communities;

public class CommunityService : ICommunityService
{
    private readonly ApplicationDbContext _dbContext;

    public CommunityService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Result<Community>> CreateAsync(Community community)
    {
        var hostExists = await _dbContext.Users.AnyAsync(ds => ds.Id == community.HostId);
        if (!hostExists)
        {
            return Result<Community>.Failure("Host not found.");
        }

        _dbContext.Communities.Add(community);
        await _dbContext.SaveChangesAsync();

        var created = await GetByIdAsync(community.Id);
        return Result<Community>.Success(created!);
    }

    public async Task<Community?> DeleteAsync(Guid CommunityId)
    {
        var Community = await _dbContext.Communities.FindAsync(CommunityId);
        if (Community is null)
        {
            return null;
        }

        _dbContext.Communities.Remove(Community);
        await _dbContext.SaveChangesAsync();

        return Community;
    }

    public async Task<ICollection<Community>> GetAllAsync()
    {
        return await _dbContext.Communities
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<Community?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Communities
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}