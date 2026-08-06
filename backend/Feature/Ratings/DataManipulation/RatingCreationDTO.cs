namespace backend.Feature.Ratings.DataManipulation;

public record RatingCreationDTO(
    Guid DriverRaceResultId,
    decimal Score
);