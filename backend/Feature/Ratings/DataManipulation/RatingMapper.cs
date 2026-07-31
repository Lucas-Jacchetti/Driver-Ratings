using backend.Domain.Entities;
using backend.Domain.ValueObjects;
using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Ratings.DataManipulation;

public static class RatingMapper
{
    public static RatingResponseDTO ToResponse(Rating rating) =>
        new(
            rating.Id,
            UserMapper.ToSummary(rating.User),
            DriverRaceResultMapper.ToSummary(rating.DriverRaceResult),
            rating.Score.Value,
            rating.RatedAt
        );

    public static RatingSummaryDTO ToSummary(Rating rating) =>
        new(rating.Id, UserMapper.ToSummary(rating.User), rating.Score.Value, rating.RatedAt);

    public static Rating ToDomain(Guid userId, Guid driverRaceResultId, decimal scoreValue) =>
        new()
        {
            UserId = userId,
            DriverRaceResultId = driverRaceResultId,
            Score = Score.Create(scoreValue),
        };
}