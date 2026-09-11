using backend.Domain.Entities;
using backend.Domain.ValueObjects;
using backend.Feature.DriverRaceResults.DataManipulation;
using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Races.DataManipulation;
using backend.Feature.Seasons.DataManipulation;

namespace DriverRatings.Tests.Unit;

public class MapperMoreTests
{
    [Fact]
    public void DriverSummaryMapper_MapsOnlySummaryFields()
    {
        var driver = new Driver { Id = Guid.NewGuid(), Name = "Max", Flag = "NL" };
        var dto = DriverMapper.ToSummary(driver);
        Assert.Equal(driver.Id, dto.Id);
        Assert.Equal(driver.Name, dto.Name);
        Assert.Equal(driver.Flag, dto.Flag);
    }

    [Fact]
    public void RaceSummaryMapper_MapsSprintFlag()
    {
        var race = new Race
        {
            Id = Guid.NewGuid(), Name = "Sprint GP", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow, SeasonId = Guid.NewGuid(), IsSprint = true
        };
        var dto = RaceMapper.ToSummary(race);
        Assert.True(dto.IsSprint);
    }

    [Fact]
    public void DriverRaceResultCreationMapper_MapsAllFields()
    {
        var request = new DriverRaceResultCreationDTO(
            Guid.NewGuid(), Guid.NewGuid(), 5, 3, 2, 1, "Context");

        var result = DriverRaceResultMapper.ToDomain(request);

        Assert.Equal(request.StartingPosition, result.StartingPosition);
        Assert.Equal(request.FinishingPosition, result.FinishingPosition);
        Assert.Equal(request.StartingPositionSprint, result.StartingPositionSprint);
        Assert.Equal(request.FinishingPositionSprint, result.FinishingPositionSprint);
        Assert.Equal(request.Context, result.Context);
        Assert.Equal(request.DriverSeasonId, result.DriverSeasonId);
        Assert.Equal(request.RaceId, result.RaceId);
    }
}
