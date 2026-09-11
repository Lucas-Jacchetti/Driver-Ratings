using backend.Domain.Entities;
using backend.Feature.Drivers.DataManipulation;
using backend.Feature.Groups.Communities.DataManipulation;
using backend.Feature.Groups.CommunityMembers.DataManipulation;
using backend.Feature.Ratings.DataManipulation;
using backend.Feature.Races.DataManipulation;
using backend.Feature.Seasons.DataManipulation;
using backend.Feature.Teams.DataManipulation;
using backend.Feature.DriverSeasons.DataManipulation;
using backend.Feature.DriverRaceResults.DataManipulation;

namespace DriverRatings.Tests.Unit;

public class MapperTests
{
    [Fact]
    public void DriverMapper_ToDomain_MapsFields()
    {
        var result = DriverMapper.ToDomain(new DriverCreationDTO("BR", "Driver"));
        Assert.Equal("BR", result.Flag);
        Assert.Equal("Driver", result.Name);
    }

    [Fact]
    public void TeamMapper_ToDomain_MapsName()
    {
        var result = TeamMapper.ToDomain(new TeamCreationDTO("Ferrari"));
        Assert.Equal("Ferrari", result.Name);
    }

    [Fact]
    public void SeasonMapper_ToDomain_MapsYear()
    {
        var result = SeasonMapper.ToDomain(new SeasonCreationDTO(2026));
        Assert.Equal(2026, result.Year);
    }

    [Fact]
    public void DriverSeasonMapper_ToDomain_MapsForeignKeys()
    {
        var driver = Guid.NewGuid();
        var team = Guid.NewGuid();
        var season = Guid.NewGuid();

        var result = DriverSeasonMapper.ToDomain(
            new DriverSeasonCreationDTO(44, driver, team, season));

        Assert.Equal(44, result.DriverNumber);
        Assert.Equal(driver, result.DriverId);
        Assert.Equal(team, result.TeamId);
        Assert.Equal(season, result.SeasonId);
    }

    [Fact]
    public void RaceMapper_ToDomain_ProducesUtcDate()
    {
        var date = new DateTime(2026, 9, 10, 12, 0, 0, DateTimeKind.Local);

        var result = RaceMapper.ToDomain(
            new RaceCreationDTO("GP", "Circuit", "BR", date, Guid.NewGuid(), true));

        Assert.Equal(DateTimeKind.Utc, result.Date.Kind);
        Assert.True(result.IsSprint);
    }

    [Fact]
    public void RatingMapper_ValidScore_CreatesRatingForUser()
    {
        var userId = Guid.NewGuid();
        var resultId = Guid.NewGuid();

        var ok = RatingMapper.TryToDomain(
            new RatingCreationDTO(resultId, 8.5m),
            userId,
            out var rating,
            out var error);

        Assert.True(ok);
        Assert.Null(error);
        Assert.NotNull(rating);
        Assert.Equal(userId, rating.UserId);
        Assert.Equal(resultId, rating.DriverRaceResultId);
        Assert.Equal(8.5m, rating.Score.Value);
    }

    [Fact]
    public void RatingMapper_InvalidScore_Fails()
    {
        var ok = RatingMapper.TryToDomain(
            new RatingCreationDTO(Guid.NewGuid(), 10.1m),
            Guid.NewGuid(),
            out var rating,
            out var error);

        Assert.False(ok);
        Assert.Null(rating);
        Assert.Equal("Score must be between 0 and 10.", error);
    }

    [Fact]
    public void CommunityMapper_PublicCommunity_HasNoAccessCode()
    {
        var result = CommunityMapper.ToDomain(
            new CommunityCreationDTO("F1", "Fans", true, null),
            Guid.NewGuid());

        Assert.True(result.IsPublic);
        Assert.Null(result.AccessCode);
    }

    [Fact]
    public void CommunityMapper_PrivateCommunity_GeneratesSixCharacterCode()
    {
        var result = CommunityMapper.ToDomain(
            new CommunityCreationDTO("F1", "Fans", false, null),
            Guid.NewGuid());

        Assert.False(result.IsPublic);
        Assert.NotNull(result.AccessCode);
        Assert.Equal(6, result.AccessCode!.Length);
    }

    [Fact]
    public void CommunityMemberMapper_ToDomain_UsesAuthenticatedUser()
    {
        var userId = Guid.NewGuid();
        var communityId = Guid.NewGuid();

        var result = CommunityMemberMapper.ToDomain(
            new CommunityMemberCreationDTO(communityId, "SECRET"), userId);

        Assert.Equal(communityId, result.CommunityId);
        Assert.Equal(userId, result.UserId);
    }
}
