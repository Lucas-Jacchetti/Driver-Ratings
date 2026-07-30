using backend.Domain.ValueObjects;
using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Ratings.DataManipulation;

public record RatingResponseDTO(
    Guid Id,
    UserResponseDTO User,
    DriverRaceResultResponseDTO DriverRaceResult,
    Score Score,
    DateTime RatedAt
);