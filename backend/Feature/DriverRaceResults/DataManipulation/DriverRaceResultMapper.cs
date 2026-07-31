using backend.Domain.Entities;
using backend.Feature.DriverSeasons.DataManipulation;
using backend.Feature.Races.DataManipulation;
using backend.Feature.Ratings.DataManipulation;

namespace backend.Feature.DriverRaceResults.DataManipulation;

public static class DriverRaceResultMapper
{
    public static DriverRaceResultResponseDTO ToResponse(DriverRaceResult result) =>
        new(
            result.Id,
            DriverSeasonMapper.ToSummary(result.DriverSeason),
            RaceMapper.ToSummary(result.Race),
            result.StartingPosition,
            result.FinishingPosition,
            result.Context,
            result.Ratings.Select(RatingMapper.ToSummary).ToList()
        );

    public static DriverRaceResultSummaryDTO ToSummary(DriverRaceResult result) =>
        new(
            result.Id,
            DriverSeasonMapper.ToSummary(result.DriverSeason),
            RaceMapper.ToSummary(result.Race),
            result.StartingPosition,
            result.FinishingPosition,
            result.Context
        );

    public static DriverRaceResult ToDomain(
        Guid driverSeasonId, Guid raceId, int startingPosition, int finishingPosition, string context) =>
        new()
        {
            DriverSeasonId = driverSeasonId,
            RaceId = raceId,
            StartingPosition = startingPosition,
            FinishingPosition = finishingPosition,
            Context = context
        };
}