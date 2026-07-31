using backend.Feature.DriverSeasons.DataManipulation;

namespace backend.Feature.Drivers.DataManipulation;

public record DriverResponseDTO(
    Guid Id,
    string Name,
    ICollection<DriverSeasonSummaryDTO> DriverSeasons
);