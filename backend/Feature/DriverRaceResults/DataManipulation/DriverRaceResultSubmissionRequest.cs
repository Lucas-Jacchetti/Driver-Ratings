namespace backend.Feature.DriverRaceResults.DataManipulation;
public record DriverRaceResultSubmissionRequest(
    ICollection<DriverRaceResultUpdateDTO> Results
);