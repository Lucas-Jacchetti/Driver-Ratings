using backend.Feature.DriverSeasons.DataManipulation;
using backend.Feature.Races.DataManipulation;
using backend.Feature.Ratings.DataManipulation;

namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultResponseDTO(
    Guid Id,
    DriverSeasonSummaryDTO DriverSeason,
    RaceSummaryDTO Race,
    int StartingPosition,
    int FinishingPosition,
    int StartingPositionSprint,
    int FinishingPositionSprint,
    string Context,
    ICollection<RatingSummaryDTO> Ratings
);