using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Seasons.DataManipulation;

public static class SeasonQueryExtensions
{
    public static IQueryable<Season> IncludeForMapping(
        this IQueryable<Season> query) =>
        query
            .Include(ds => ds.Races)
            .Include(ds => ds.DriverSeasons);
}