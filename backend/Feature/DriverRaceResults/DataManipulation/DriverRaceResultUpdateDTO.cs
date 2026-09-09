namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultUpdateDTO(
    Guid DriverRaceResultId,
    int StartingPosition,
    int FinishingPosition,
    int StartingPositionSprint,
    int FinishingPositionSprint,
    string Context
);