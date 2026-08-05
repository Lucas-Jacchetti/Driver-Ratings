namespace backend.Feature.Ratings.DataManipulation;

public record RatingCreationDTO(
    Guid UserId,
    Guid DriverRaceResultId,
    decimal Score
);