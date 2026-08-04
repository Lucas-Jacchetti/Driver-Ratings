using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Groups.CommunityMembers.DataManipulation;

public static class CommunityMemberQueryExtensions
{
    public static IQueryable<CommunityMember> IncludeForMapping(
        this IQueryable<CommunityMember> query) =>
        query
            .Include(ds => ds.Community)
            .Include(ds => ds.User);
}