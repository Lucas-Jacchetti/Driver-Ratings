using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Season.DataManipulation;
using backend.Feature.Teams.DataManipulation;

namespace backend.Feature.Races.DataManipulation;

public record RaceResponseDTO(
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