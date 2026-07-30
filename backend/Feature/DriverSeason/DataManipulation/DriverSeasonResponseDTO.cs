using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Teams.DataManipulation;

namespace backend.Feature.DriverSeason.DataManipulation;

public record DriverSeasonResponseDTO(
    Guid Id,
    int DriverNumber,

    Guid DriverId,
    DriverResponseDTO Driver,

    Guid TeamId,
    TeamResponseDTO Team,

    Guid SeasonId,
    SeasonResponseDTO Season,

    ICollection<DriverRaceResultResponseDTO> DriverRaceResults
);