using backend.Domain.Entities;
using backend.Feature.DriverSeasons.DataManipulation;
using backend.Feature.Races.DataManipulation;

namespace backend.Feature.Seasons.DataManipulation;

public static class SeasonMapper
{
    public static SeasonResponseDTO ToResponse(Season season) =>
        new(
            season.Id,
            season.Year,
            season.Races.Select(RaceMapper.ToSummary).ToList(),
            season.DriverSeasons.Select(DriverSeasonMapper.ToSummary).ToList()
        );

    public static SeasonSummaryDTO ToSummary(Season season) =>
        new(season.Id, season.Year);

    public static Season ToDomain(int year) =>
        new() { Year = year };
}