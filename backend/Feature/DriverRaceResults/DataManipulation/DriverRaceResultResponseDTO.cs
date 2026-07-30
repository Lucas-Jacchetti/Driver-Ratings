using backend.Feature.DriverSeason.DataManipulation;
using backend.Feature.Races.DataManipulation;
using backend.Feature.Ratings.DataManipulation;

namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultResponseDTO(
    Guid Id,

    Guid DriverSeasonId,
    DriverSeasonResponseDTO DriverSeason,

    Guid RaceId,
    RaceResponseDTO Race,

    int StartingPosition,
    int FinishingPosition, // 0 = DNF/DNS
    string Context,

    ICollection<RatingResponseDTO> Ratings
);