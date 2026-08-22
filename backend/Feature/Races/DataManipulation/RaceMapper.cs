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
            race.Flag,
            race.Date.ToString("dd/MM/yyyy"),
            SeasonMapper.ToSummary(race.Season),
            race.DriverRaceResults.Select(DriverRaceResultMapper.ToSummary).ToList()
        );

    public static RaceSummaryDTO ToSummary(Race race) =>
        new(race.Id, race.Name, race.Circuit, race.Flag, race.Date);

    public static Race ToDomain(RaceCreationDTO raceCreationDTO) =>
        new() { Name = raceCreationDTO.Name, Circuit = raceCreationDTO.Circuit, Flag = raceCreationDTO.Flag, Date = DateTime.SpecifyKind(raceCreationDTO.Date, DateTimeKind.Utc), SeasonId = raceCreationDTO.SeasonId };
}