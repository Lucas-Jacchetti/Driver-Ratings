namespace backend.Feature.Ratings.DataManipulation;

public record RatingResponseDTO(
    Guid Id,
    decimal Score,
    Guid UserId,
    string UserName,
    string DriverName,
    string TeamName,
    string RaceName,
    DateTime RatedAt
);