namespace backend.Feature.Races.DataManipulation;

public record RaceCreationDTO(
    string Name,
    string Circuit,
    DateTime Date,
    Guid SeasonId
);