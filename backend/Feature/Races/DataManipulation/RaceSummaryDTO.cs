namespace backend.Feature.Races.DataManipulation;

public record RaceSummaryDTO(
    Guid Id, 
    string Name, 
    string Circuit, 
    DateTime Date
);