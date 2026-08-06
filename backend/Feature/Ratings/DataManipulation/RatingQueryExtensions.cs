using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Ratings.DataManipulation;

public static class RatingQueryExtensions
{
    public static IQueryable<Rating> IncludeForMapping(
        this IQueryable<Rating> query) =>
        query
            .Include(r => r.User)
            .Include(r => r.DriverRaceResult)
                .ThenInclude(drr => drr.DriverSeason)
                    .ThenInclude(ds => ds.Driver)
            .Include(r => r.DriverRaceResult)
                .ThenInclude(drr => drr.DriverSeason)
                    .ThenInclude(ds => ds.Team)
            .Include(r => r.DriverRaceResult)
                .ThenInclude(drr => drr.Race);
}