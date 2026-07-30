namespace backend.Feature.DriverSeason.DataManipulation;

public record DriverSeasonCreationDTO(
    int DriverNumber,
    Guid DriverId,
    Guid TeamId,
    Guid SeasonId
);