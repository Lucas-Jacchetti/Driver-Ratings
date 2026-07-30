using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Teams.DataManipulation;

namespace backend.Feature.Season.DataManipulation;

public record SeasonResponseDTO(
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