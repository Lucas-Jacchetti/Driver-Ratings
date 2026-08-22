using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Seasons.DataManipulation;
namespace backend.Feature.Races.DataManipulation;

public record RaceResponseDTO(
    Guid Id,
    string Name,
    string Circuit,
    string Flag,
    string Date,
    SeasonSummaryDTO Season,
    ICollection<DriverRaceResultSummaryDTO> DriverRaceResults
);