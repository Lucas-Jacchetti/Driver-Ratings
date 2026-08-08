namespace backend.Feature.Ratings.DataManipulation;
public record DriverSeasonRating(
    Guid DriverSeasonId,
    string DriverName,
    decimal AverageRating
);