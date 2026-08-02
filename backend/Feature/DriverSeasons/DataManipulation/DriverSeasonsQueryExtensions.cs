using Microsoft.EntityFrameworkCore;

namespace backend.Feature.DriverSeasons.DataManipulation;

public static class DriverSeasonQueryExtensions
{
    public static IQueryable<Domain.Entities.DriverSeason> IncludeForMapping(
        this IQueryable<Domain.Entities.DriverSeason> query) =>
        query
            .Include(ds => ds.Driver)
            .Include(ds => ds.DriverRaceResults)
            .Include(ds => ds.Team)
            .Include(ds => ds.Season);
}