using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Seasons.DataManipulation;
using backend.Feature.Teams.DataManipulation;

namespace backend.Feature.DriverSeasons.DataManipulation;

public record DriverSeasonResponseDTO(
    Guid Id,
    int DriverNumber,
    DriverSummaryDTO Driver,
    TeamResponseDTO Team,
    SeasonSummaryDTO Season,
    ICollection<DriverRaceResultSummaryDTO> DriverRaceResults
);