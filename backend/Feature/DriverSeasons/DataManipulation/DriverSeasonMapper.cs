using backend.Domain.Entities;
using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Seasons.DataManipulation;
using backend.Feature.Teams.DataManipulation;

namespace backend.Feature.DriverSeasons.DataManipulation;

public static class DriverSeasonMapper
{
    public static DriverSeasonResponseDTO ToResponse(DriverSeason driverSeason) =>
        new(
            driverSeason.Id,
            driverSeason.DriverNumber,
            DriverMapper.ToSummary(driverSeason.Driver),
            TeamMapper.ToResponse(driverSeason.Team),
            SeasonMapper.ToSummary(driverSeason.Season),
            driverSeason.DriverRaceResults.Select(DriverRaceResultMapper.ToSummary).ToList()
        );

    public static DriverSeasonSummaryDTO ToSummary(DriverSeason driverSeason) =>
        new(
            driverSeason.Id,
            driverSeason.DriverNumber,
            DriverMapper.ToSummary(driverSeason.Driver),
            TeamMapper.ToResponse(driverSeason.Team),
            SeasonMapper.ToSummary(driverSeason.Season)
        );

    public static DriverSeason ToDomain(DriverSeasonCreationDTO driverSeasonCreationDTO) =>
        new()
        {
            DriverNumber = driverSeasonCreationDTO.DriverNumber,
            DriverId = driverSeasonCreationDTO.DriverId,
            TeamId = driverSeasonCreationDTO.TeamId,
            SeasonId = driverSeasonCreationDTO.SeasonId
        };
}