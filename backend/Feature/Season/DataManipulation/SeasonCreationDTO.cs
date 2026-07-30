using backend.Feature.DriverSeason.DataManipulation;
using backend.Feature.Races.DataManipulation;

namespace backend.Feature.Season.DataManipulation;

public record SeasonCreationDTO(
    int Year,
    ICollection<RaceResponseDTO> Races,
    ICollection<DriverSeasonResponseDTO> DriverSeasons
);