using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.DriverRaceResults.DataManipulation;

public static class DriverRaceResultQueryExtensions
{
    public static IQueryable<DriverRaceResult> IncludeForMapping(
        this IQueryable<DriverRaceResult> query) =>
        query
            .Include(drr => drr.DriverSeason)
                .ThenInclude(ds => ds.Driver)
            .Include(drr => drr.DriverSeason)
                .ThenInclude(ds => ds.Team)
            .Include(drr => drr.DriverSeason)
                .ThenInclude(ds => ds.Season)
            .Include(drr => drr.Race)
            .Include(drr => drr.Ratings);
}