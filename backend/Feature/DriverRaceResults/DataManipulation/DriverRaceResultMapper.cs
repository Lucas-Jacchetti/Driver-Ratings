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

    public static DriverRaceResult ToDomain(DriverRaceResultCreationDTO driverRaceResultCreationDTO) =>
        new()
        {
            DriverSeasonId = driverRaceResultCreationDTO.DriverSeasonId,
            RaceId = driverRaceResultCreationDTO.RaceId,
            StartingPosition = driverRaceResultCreationDTO.StartingPosition,
            FinishingPosition = driverRaceResultCreationDTO.FinishingPosition,
            Context = driverRaceResultCreationDTO.Context
        };
}