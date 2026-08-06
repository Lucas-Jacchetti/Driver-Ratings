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
            rating.Score.Value,
            rating.UserId,
            rating.User.Name,
            rating.DriverRaceResult.DriverSeason.Driver.Name,
            rating.DriverRaceResult.DriverSeason.Team.Name,
            rating.DriverRaceResult.Race.Name,
            rating.RatedAt
        );

    public static RatingSummaryDTO ToSummary(Rating rating) =>
        new(rating.Id, UserMapper.ToSummary(rating.User), rating.Score.Value, rating.RatedAt);

    public static Rating ToDomain(RatingCreationDTO ratingCreationDTO, Guid userId) =>
        new()
        {
            UserId = userId,
            DriverRaceResultId = ratingCreationDTO.DriverRaceResultId,
            Score = Score.Create(ratingCreationDTO.Score),
        };
}