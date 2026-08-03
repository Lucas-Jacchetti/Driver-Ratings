using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.DriverRaceResults.DataManipulation;

public static class DriverRaceResultQueryExtensions
{
    public static IQueryable<DriverRaceResult> IncludeForMapping(
        this IQueryable<DriverRaceResult> query) =>
        query
            .Include(ds => ds.DriverSeason)
            .Include(ds => ds.Race)
            .Include(ds => ds.Ratings);
}