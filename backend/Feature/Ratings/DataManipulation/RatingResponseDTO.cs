using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Ratings.DataManipulation;

public record RatingResponseDTO(
    Guid Id,
    decimal Score,
    Guid UserId,
    string UserName,
    int StartingPosition,
    int FinishingPosition,
    string Context,
    string DriverName,
    string TeamName,
    string RaceName,
    DateTime RatedAt
);