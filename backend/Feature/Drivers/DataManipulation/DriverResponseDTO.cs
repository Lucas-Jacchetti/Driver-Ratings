using backend.Feature.DriverSeason.DataManipulation;

namespace backend.Feature.Drivers.DataManipulation;

public record DriverResponseDTO(
    Guid Id,
    string Name,
    ICollection<DriverSeasonResponseDTO> DriverSeasons
);