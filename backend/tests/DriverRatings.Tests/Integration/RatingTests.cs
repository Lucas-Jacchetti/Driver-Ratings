using System.Net;
using System.Net.Http.Json;
using backend.Domain.Entities;
using backend.Domain.Roles;
using Microsoft.Extensions.DependencyInjection;

namespace DriverRatings.Tests.Integration;

[Collection("Integration")]
public class RatingTests : ApiTestBase
{
    public RatingTests(IntegrationTestFactory factory) : base(factory) { }

    private async Task<(User user, string token, Race race, DriverRaceResult result)> SeedRatingScenarioAsync()
    {
        var (user, token) = await Factory.CreateUserAsync();
        var season = new Season { Id = Guid.NewGuid(), Year = 2026 };
        var driver = Driver();
        var team = Team();
        var ds = new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 44, DriverId = driver.Id,
            TeamId = team.Id, SeasonId = season.Id
        };
        var race = new Race
        {
            Id = Guid.NewGuid(), Name = "Rating GP", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow.AddDays(-2), SeasonId = season.Id, IsSprint = false
        };
        var result = new DriverRaceResult
        {
            Id = Guid.NewGuid(), DriverSeasonId = ds.Id, RaceId = race.Id,
            StartingPosition = 1, FinishingPosition = 1, StartingPositionSprint = 0,
            FinishingPositionSprint = 0, Context = "Normal"
        };
        await Factory.SeedAsync(season, driver, team, ds, race, result);
        return (user, token, race, result);
    }

    [Fact]
    public async Task Anonymous_CreateRating_Returns401()
    {
        await ResetAsync();
        var response = await Client().PostAsJsonAsync("/api/Rating", new
        {
            driverRaceResultId = Guid.NewGuid(), score = 8.0m
        });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task InvalidScore_IsRejectedBeforeService()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync();
        var response = await Client(token).PostAsJsonAsync("/api/Rating", new
        {
            driverRaceResultId = Guid.NewGuid(), score = 10.1m
        });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task RatingBeforeOpenTime_IsRejected()
    {
        await ResetAsync();
        var (user, token) = await Factory.CreateUserAsync();
        var season = new Season { Id = Guid.NewGuid(), Year = 2026 };
        var driver = Driver();
        var team = Team();
        var ds = new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 44, DriverId = driver.Id,
            TeamId = team.Id, SeasonId = season.Id
        };
        var race = new Race
        {
            Id = Guid.NewGuid(), Name = "Future GP", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow.AddHours(1), SeasonId = season.Id
        };
        var result = new DriverRaceResult
        {
            Id = Guid.NewGuid(), DriverSeasonId = ds.Id, RaceId = race.Id,
            StartingPosition = 1, FinishingPosition = 1, StartingPositionSprint = 0,
            FinishingPositionSprint = 0, Context = ""
        };
        await Factory.SeedAsync(season, driver, team, ds, race, result);

        var response = await Client(token).PostAsJsonAsync("/api/Rating", new
        {
            driverRaceResultId = result.Id, score = 8.0m
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UserCanCreateRating_AndCannotRateSameResultTwice()
    {
        await ResetAsync();
        var (_, token, _, result) = await SeedRatingScenarioAsync();
        var request = new { driverRaceResultId = result.Id, score = 8.5m };

        var first = await Client(token).PostAsJsonAsync("/api/Rating", request);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await Client(token).PostAsJsonAsync("/api/Rating", request);
        Assert.Equal(HttpStatusCode.BadRequest, second.StatusCode);

        var text = await second.Content.ReadAsStringAsync();
        Assert.Contains("already rated", text, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task UserCanSubmitAllRaceRatings()
    {
        await ResetAsync();
        var (_, token, race, result) = await SeedRatingScenarioAsync();

        var response = await Client(token).PostAsJsonAsync("/api/Rating/race", new
        {
            raceId = race.Id,
            ratings = new[] { new { driverRaceResultId = result.Id, score = 9.0m } }
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UserCanUpdateExistingRaceRating()
    {
        await ResetAsync();
        var (_, token, race, result) = await SeedRatingScenarioAsync();

        var create = await Client(token).PostAsJsonAsync("/api/Rating/race", new
        {
            raceId = race.Id,
            ratings = new[] { new { driverRaceResultId = result.Id, score = 6.0m } }
        });
        Assert.Equal(HttpStatusCode.OK, create.StatusCode);

        var update = await Client(token).PutAsJsonAsync("/api/Rating/race/update", new
        {
            raceId = race.Id,
            ratings = new[] { new { driverRaceResultId = result.Id, score = 9.0m } }
        });
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);

        using var scope = Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<backend.Data.ApplicationDbContext>();
        var rating = db.Ratings.Single();
        Assert.Equal(9.0m, rating.Score.Value);
    }

    [Fact]
    public async Task GlobalAndUserRatings_ReturnExpectedScore()
    {
        await ResetAsync();
        var (user, token, race, result) = await SeedRatingScenarioAsync();

        var create = await Client(token).PostAsJsonAsync("/api/Rating", new
        {
            driverRaceResultId = result.Id, score = 8.75m
        });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var global = await Client().GetAsync("/api/Rating/global?year=2026");
        Assert.Equal(HttpStatusCode.OK, global.StatusCode);
        Assert.Contains("8.75", await global.Content.ReadAsStringAsync());

        var mine = await Client(token).GetAsync("/api/Rating/user?year=2026");
        Assert.Equal(HttpStatusCode.OK, mine.StatusCode);
        Assert.Contains("8.75", await mine.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task AdminCanDeleteRating()
    {
        await ResetAsync();
        var (_, token, _, result) = await SeedRatingScenarioAsync();
        var create = await Client(token).PostAsJsonAsync("/api/Rating", new
        {
            driverRaceResultId = result.Id, score = 8m
        });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var body = await create.Content.ReadFromJsonAsync<RatingDto>();
        Assert.NotNull(body);

        var (_, adminToken) = await Factory.CreateUserAsync("Admin", UserRoles.Admin);
        var delete = await Client(adminToken).DeleteAsync($"/api/Rating/{body!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
    }

    private sealed record RatingDto(Guid Id, decimal Score, Guid UserId, string UserName, string DriverName, string TeamName, string RaceName, DateTime RatedAt);
}
