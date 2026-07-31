namespace backend.Feature.DriverSeasons.DataManipulation;

public record DriverSeasonCreationDTO(
    int DriverNumber,
    Guid DriverId,
    Guid TeamId,
    Guid SeasonId
);