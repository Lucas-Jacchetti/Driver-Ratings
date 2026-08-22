namespace backend.Feature.Races.DataManipulation;

public record RaceCreationDTO(
    string Name,
    string Circuit,
    string Flag,
    DateTime Date,
    Guid SeasonId
);