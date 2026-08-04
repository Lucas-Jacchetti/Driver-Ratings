using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Ratings.DataManipulation;

public static class RatingQueryExtensions
{
    public static IQueryable<Rating> IncludeForMapping(
        this IQueryable<Rating> query) =>
        query
            .Include(ds => ds.User)
            .Include(ds => ds.DriverRaceResult)
            .Include(ds => ds.Score);
}