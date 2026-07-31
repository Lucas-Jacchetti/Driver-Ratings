using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Ratings.DataManipulation;

public record RatingResponseDTO(
    Guid Id,
    UserSummaryDTO User,
    DriverRaceResultSummaryDTO DriverRaceResult,
    decimal Score,
    DateTime RatedAt
);