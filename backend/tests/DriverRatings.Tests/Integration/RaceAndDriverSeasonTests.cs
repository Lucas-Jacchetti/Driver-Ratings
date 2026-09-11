using System.Net;
using System.Net.Http.Json;
using backend.Domain.Entities;
using backend.Domain.Roles;
using Microsoft.Extensions.DependencyInjection;

namespace DriverRatings.Tests.Integration;

[Collection("Integration")]
public class RaceAndDriverSeasonTests : ApiTestBase
{
    public RaceAndDriverSeasonTests(IntegrationTestFactory factory) : base(factory) { }

    [Fact]
    public async Task DriverSeason_CreateWithMissingDependencies_ReturnsBadRequest()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);

        var response = await Client(token).PostAsJsonAsync("/api/DriverSeason", new
        {
            driverNumber = 44,
            driverId = Guid.NewGuid(),
            teamId = Guid.NewGuid(),
            seasonId = Guid.NewGuid()
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DriverSeason_CreateThenDuplicate_ReturnsBadRequest()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);
        var driver = Driver();
        var team = Team();
        var season = new Season { Id = Guid.NewGuid(), Year = 2026 };
        await Factory.SeedAsync(driver, team, season);

        var request = new
        {
            driverNumber = 44,
            driverId = driver.Id,
            teamId = team.Id,
            seasonId = season.Id
        };

        Assert.Equal(HttpStatusCode.Created,
            (await Client(token).PostAsJsonAsync("/api/DriverSeason", request)).StatusCode);

        var duplicate = await Client(token).PostAsJsonAsync("/api/DriverSeason", request);
        Assert.Equal(HttpStatusCode.BadRequest, duplicate.StatusCode);
    }

    [Fact]
    public async Task CreatingRace_CreatesDriverRaceResults()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);
        var season = new Season { Id = Guid.NewGuid(), Year = 2026 };
        var driver1 = Driver(name: "Driver A");
        var driver2 = Driver(name: "Driver B");
        var team1 = Team(name: "Team A");
        var team2 = Team(name: "Team B");
        var ds1 = new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 1, DriverId = driver1.Id,
            TeamId = team1.Id, SeasonId = season.Id
        };
        var ds2 = new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 2, DriverId = driver2.Id,
            TeamId = team2.Id, SeasonId = season.Id
        };
        await Factory.SeedAsync(season, driver1, driver2, team1, team2, ds1, ds2);

        var raceRequest = new
        {
            name = "Integration GP",
            circuit = "Test Circuit",
            flag = "BR",
            date = DateTime.UtcNow.AddDays(-2),
            seasonId = season.Id,
            isSprint = true
        };

        var create = await Client(token).PostAsJsonAsync("/api/Race", raceRequest);
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        using var scope = Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<backend.Data.ApplicationDbContext>();
        var race = db.Races.Single(r => r.Name == "Integration GP");
        var results = db.DriverRaceResults.Where(r => r.RaceId == race.Id).ToList();

        Assert.Equal(2, results.Count);
        Assert.All(results, r =>
        {
            Assert.Equal(0, r.StartingPosition);
            Assert.Equal(0, r.FinishingPosition);
            Assert.Equal(0, r.StartingPositionSprint);
            Assert.Equal(0, r.FinishingPositionSprint);
            Assert.Equal(string.Empty, r.Context);
        });
    }

    [Fact]
    public async Task Admin_CanUpdateRaceResults()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);
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
            Id = Guid.NewGuid(), Name = "GP", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow.AddDays(-1), SeasonId = season.Id, IsSprint = true
        };
        var result = new DriverRaceResult
        {
            Id = Guid.NewGuid(), DriverSeasonId = ds.Id, RaceId = race.Id,
            StartingPosition = 0, FinishingPosition = 0, StartingPositionSprint = 0,
            FinishingPositionSprint = 0, Context = string.Empty
        };
        await Factory.SeedAsync(season, driver, team, ds, race, result);

        var response = await Client(token).PutAsJsonAsync(
            $"/api/DriverRaceResult/race/{race.Id}",
            new
            {
                results = new[]
                {
                    new
                    {
                        driverRaceResultId = result.Id,
                        startingPosition = 4,
                        finishingPosition = 2,
                        startingPositionSprint = 3,
                        finishingPositionSprint = 1,
                        context = "Strong race"
                    }
                }
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = Factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<backend.Data.ApplicationDbContext>();
        var saved = db.DriverRaceResults.Single(x => x.Id == result.Id);
        Assert.Equal(4, saved.StartingPosition);
        Assert.Equal(2, saved.FinishingPosition);
        Assert.Equal(3, saved.StartingPositionSprint);
        Assert.Equal(1, saved.FinishingPositionSprint);
        Assert.Equal("Strong race", saved.Context);
    }
}
