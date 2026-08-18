using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Seasons.DataManipulation;

public static class SeasonQueryExtensions
{
    public static IQueryable<Season> IncludeForMapping(
        this IQueryable<Season> query) =>
        query
            .Include(s => s.Races)
            .Include(s => s.DriverSeasons)
                .ThenInclude(ds => ds.Driver)
            .Include(s => s.DriverSeasons)
                .ThenInclude(ds => ds.Team);
}