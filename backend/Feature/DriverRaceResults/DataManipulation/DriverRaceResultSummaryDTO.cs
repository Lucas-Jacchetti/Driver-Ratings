using backend.Feature.DriverSeasons.DataManipulation;
using backend.Feature.Races.DataManipulation;

namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultSummaryDTO(
    Guid Id,
    DriverSeasonSummaryDTO DriverSeason,
    RaceSummaryDTO Race,
    int StartingPosition,
    int FinishingPosition,
    string Context
);