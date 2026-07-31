using backend.Feature.DriverSeasons.DataManipulation;
using backend.Feature.Races.DataManipulation;

namespace backend.Feature.Seasons.DataManipulation;

public record SeasonResponseDTO(
    Guid Id,
    int Year,
    ICollection<RaceSummaryDTO> Races,
    ICollection<DriverSeasonSummaryDTO> DriverSeasons
);