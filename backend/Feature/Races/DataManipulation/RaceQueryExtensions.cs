using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Races.DataManipulation;

public static class RaceQueryExtensions
{
    public static IQueryable<Race> IncludeForMapping(
        this IQueryable<Race> query) =>
        query
            .Include(r => r.Season)
            .Include(r => r.DriverRaceResults)
                .ThenInclude(drr => drr.DriverSeason)
                    .ThenInclude(ds => ds.Driver)
            .Include(r => r.DriverRaceResults)
                .ThenInclude(drr => drr.DriverSeason)
                    .ThenInclude(ds => ds.Team)
            .Include(r => r.DriverRaceResults)
                .ThenInclude(drr => drr.DriverSeason)
                    .ThenInclude(ds => ds.Season);
}