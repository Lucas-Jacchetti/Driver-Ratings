namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultUpdateDTO(
    Guid DriverRaceResultId,
    int StartingPosition,
    int FinishingPosition,
    string Context
);