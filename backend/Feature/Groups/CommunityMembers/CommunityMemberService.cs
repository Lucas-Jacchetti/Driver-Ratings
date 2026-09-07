using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Feature.Groups.CommunityMembers.DataManipulation;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.Groups.CommunityMembers;

public class CommunityMemberService : ICommunityMemberService
{
    private readonly ApplicationDbContext _dbContext;

    public CommunityMemberService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Result<CommunityMember>> CreateAsync(CommunityMember communityMember, string? accessToken)
    {
        var userExists = await _dbContext.Users.AnyAsync(ds => ds.Id == communityMember.UserId);
        if (!userExists)
        {
            return Result<CommunityMember>.Failure("User not found.");
        }

        var communityExists = await _dbContext.Communities.AnyAsync(ds => ds.Id == communityMember.CommunityId);
        if (!communityExists)
        {
            return Result<CommunityMember>.Failure("Community not found.");
        }

        var community = await _dbContext.Communities.FindAsync(communityMember.CommunityId);

        if (communityMember.UserId == community!.HostId)
        {
            return Result<CommunityMember>.Failure("Host cannot join their own community.");
        }

        if(await _dbContext.CommunityMembers.AnyAsync(cm => cm.CommunityId == communityMember.CommunityId && cm.UserId == communityMember.UserId))
        {
            return Result<CommunityMember>.Failure("User is already a member of this community.");
        }
        
        if (!community!.IsPublic && community.AccessCode != accessToken)
        {
            return Result<CommunityMember>.Failure("Incorrect access code.");
        }

        _dbContext.CommunityMembers.Add(communityMember);
        await _dbContext.SaveChangesAsync();

        var created = await GetByIdAsync(communityMember.Id);
        return Result<CommunityMember>.Success(created!);
    }

    public async Task<CommunityMember?> LeaveAsync(Guid communityId, Guid userId)
    {
        var communityMember = await _dbContext.CommunityMembers
            .FirstOrDefaultAsync(m => m.CommunityId == communityId && m.UserId == userId);

        if (communityMember is null)
        {
            return null;
        }

        _dbContext.CommunityMembers.Remove(communityMember);
        await _dbContext.SaveChangesAsync();

        return communityMember;
    }

    public async Task<ICollection<CommunityMember>> GetAllAsync()
    {
        return await _dbContext.CommunityMembers
            .IncludeForMapping()
            .ToListAsync();
    }

    public async Task<CommunityMember?> GetByIdAsync(Guid id)
    {
        return await _dbContext.CommunityMembers
            .IncludeForMapping()
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<bool> IsMemberAsync(Guid communityId, Guid userId)
    {
        var isExplicitMember = await _dbContext.CommunityMembers
            .AnyAsync(cm => cm.CommunityId == communityId && cm.UserId == userId);

        if (isExplicitMember)
        {
            return true;
        }

        return await _dbContext.Communities
            .AnyAsync(c => c.Id == communityId && c.HostId == userId);
    }
}