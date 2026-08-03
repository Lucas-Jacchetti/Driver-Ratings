using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.DriverSeasons.DataManipulation;

public static class DriverSeasonQueryExtensions
{
    public static IQueryable<DriverSeason> IncludeForMapping(
        this IQueryable<DriverSeason> query) =>
        query
            .Include(ds => ds.Driver)
            .Include(ds => ds.DriverRaceResults)
            .Include(ds => ds.Team)
            .Include(ds => ds.Season);
}