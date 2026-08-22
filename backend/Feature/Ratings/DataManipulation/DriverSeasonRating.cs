namespace backend.Feature.Ratings.DataManipulation;
public record DriverSeasonRating(
    Guid DriverSeasonId,
    string DriverName,
    string TeamName,
    string DriverFlag,
    decimal AverageRating
);