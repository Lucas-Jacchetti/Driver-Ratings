namespace backend.Feature.DriverRaceResults.DataManipulation;

public record DriverRaceResultCreationDTO(
    Guid DriverSeasonId,
    Guid RaceId,
    int StartingPosition,
    int FinishingPosition,
    string Context
);