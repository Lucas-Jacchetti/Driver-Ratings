namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultCreationDTO(
    Guid DriverSeasonId,
    Guid RaceId,
    int StartingPosition,
    int FinishingPosition,
    int StartingPositionSprint,
    int FinishingPositionSprint,
    string Context
);