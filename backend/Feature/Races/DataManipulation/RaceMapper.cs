using backend.Domain.Entities;
using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Seasons.DataManipulation;

namespace backend.Feature.Races.DataManipulation;

public static class RaceMapper
{
    public static RaceResponseDTO ToResponse(Race race) =>
        new(
            race.Id,
            race.Name,
            race.Circuit,
            race.Date,
            SeasonMapper.ToSummary(race.Season),
            race.DriverRaceResults.Select(DriverRaceResultMapper.ToSummary).ToList()
        );

    public static RaceSummaryDTO ToSummary(Race race) =>
        new(race.Id, race.Name, race.Circuit, race.Date);

    public static Race ToDomain(string name, string circuit, DateTime date, Guid seasonId) =>
        new() { Name = name, Circuit = circuit, Date = date, SeasonId = seasonId };
}