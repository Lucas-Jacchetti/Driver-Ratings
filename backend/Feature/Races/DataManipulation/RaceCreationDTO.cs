using backend.Feature.DriverSeason.DataManipulation;

namespace backend.Feature.Races.DataManipulation;

public record RaceCreationDTO(
    int Year,
    ICollection<RaceResponseDTO> Races,
    ICollection<DriverSeasonResponseDTO> DriverSeasons
);