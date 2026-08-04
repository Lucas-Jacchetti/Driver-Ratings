using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Groups.Communities.DataManipulation;

public static class CommunityQueryExtensions
{
    public static IQueryable<Community> IncludeForMapping(
        this IQueryable<Community> query) =>
        query
            .Include(ds => ds.Host)
            .Include(ds => ds.Members);
}