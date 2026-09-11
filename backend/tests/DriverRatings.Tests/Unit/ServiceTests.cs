using backend.Domain.Entities;
using backend.Domain.Roles;
using backend.Domain.ValueObjects;
using backend.Feature.Drivers;
using backend.Feature.DriverSeasons;
using backend.Feature.Races;
using backend.Feature.Seasons;
using backend.Feature.Teams;
using backend.Feature.Users;
using backend.Feature.Groups.Communities;
using backend.Feature.Groups.CommunityMembers;
using backend.Feature.Groups.Communities.DataManipulation;
using backend.Feature.DriverRaceResults;
using backend.Feature.Ratings;
using backend.Feature.Ratings.Contracts;
using backend.Feature.DriverRaceResults.DataManipulation;

namespace DriverRatings.Tests.Unit;

public class ServiceTests
{
    private static User User(string? email = null) => new()
    {
        Id = Guid.NewGuid(),
        Name = "Test User",
        Email = email ?? $"{Guid.NewGuid()}@example.com",
        GoogleId = $"google-{Guid.NewGuid()}"
    };

    [Fact]
    public async Task DriverService_CreateThenGet_ReturnsDriver()
    {
        await using var db = TestDb.Create();
        var service = new DriverService(db);
        var driver = new Driver { Id = Guid.NewGuid(), Name = "Driver", Flag = "BR" };

        var created = await service.CreateAsync(driver);
        var found = await service.GetByIdAsync(driver.Id);

        Assert.NotNull(created);
        Assert.Equal(driver.Id, found!.Id);
    }

    [Fact]
    public async Task DriverService_DeleteMissing_ReturnsNull()
    {
        await using var db = TestDb.Create();
        Assert.Null(await new DriverService(db).DeleteAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task TeamService_DuplicateName_ReturnsNull()
    {
        await using var db = TestDb.Create();
        db.Teams.Add(new Team { Id = Guid.NewGuid(), Name = "Ferrari" });
        await db.SaveChangesAsync();

        var result = await new TeamService(db).CreateAsync(
            new Team { Id = Guid.NewGuid(), Name = "Ferrari" });

        Assert.Null(result);
        Assert.Single(db.Teams);
    }

    [Fact]
    public async Task TeamService_GetAll_IsAlphabetical()
    {
        await using var db = TestDb.Create();
        db.Teams.AddRange(
            new Team { Id = Guid.NewGuid(), Name = "Williams" },
            new Team { Id = Guid.NewGuid(), Name = "Ferrari" },
            new Team { Id = Guid.NewGuid(), Name = "McLaren" });
        await db.SaveChangesAsync();

        var result = await new TeamService(db).GetAllAsync();

        Assert.Equal(new[] { "Ferrari", "McLaren", "Williams" }, result.Select(t => t.Name));
    }

    [Fact]
    public async Task SeasonService_YearBefore2026_ReturnsNull()
    {
        await using var db = TestDb.Create();
        var result = await new SeasonService(db).CreateAsync(new Season { Id = Guid.NewGuid(), Year = 2025 });
        Assert.Null(result);
    }

    [Fact]
    public async Task SeasonService_2026_ReturnsCreatedSeason()
    {
        await using var db = TestDb.Create();
        var result = await new SeasonService(db).CreateAsync(new Season { Id = Guid.NewGuid(), Year = 2026 });
        Assert.NotNull(result);
    }

    [Fact]
    public async Task DriverSeasonService_MissingDriver_Fails()
    {
        await using var db = TestDb.Create();
        var result = await new DriverSeasonService(db).CreateAsync(new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 1, DriverId = Guid.NewGuid(),
            TeamId = Guid.NewGuid(), SeasonId = Guid.NewGuid()
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("Driver not found.", result.Error);
    }

    [Fact]
    public async Task DriverSeasonService_MissingTeam_Fails()
    {
        await using var db = TestDb.Create();
        var driver = new Driver { Id = Guid.NewGuid(), Name = "Driver", Flag = "BR" };
        db.Drivers.Add(driver);
        await db.SaveChangesAsync();

        var result = await new DriverSeasonService(db).CreateAsync(new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 1, DriverId = driver.Id,
            TeamId = Guid.NewGuid(), SeasonId = Guid.NewGuid()
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("Team not found.", result.Error);
    }

    [Fact]
    public async Task DriverSeasonService_MissingSeason_Fails()
    {
        await using var db = TestDb.Create();
        var driver = new Driver { Id = Guid.NewGuid(), Name = "Driver", Flag = "BR" };
        var team = new Team { Id = Guid.NewGuid(), Name = "Team" };
        db.Drivers.Add(driver);
        db.Teams.Add(team);
        await db.SaveChangesAsync();

        var result = await new DriverSeasonService(db).CreateAsync(new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 1, DriverId = driver.Id,
            TeamId = team.Id, SeasonId = Guid.NewGuid()
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("Season not found.", result.Error);
    }

    [Fact]
    public async Task DriverSeasonService_DuplicateDriverSeason_Fails()
    {
        await using var db = TestDb.Create();
        var driver = new Driver { Id = Guid.NewGuid(), Name = "Driver", Flag = "BR" };
        var team = new Team { Id = Guid.NewGuid(), Name = "Team" };
        var season = new Season { Id = Guid.NewGuid(), Year = 2026 };
        db.AddRange(driver, team, season);
        db.DriverSeasons.Add(new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 1, DriverId = driver.Id,
            TeamId = team.Id, SeasonId = season.Id
        });
        await db.SaveChangesAsync();

        var result = await new DriverSeasonService(db).CreateAsync(new DriverSeason
        {
            Id = Guid.NewGuid(), DriverNumber = 2, DriverId = driver.Id,
            TeamId = team.Id, SeasonId = season.Id
        });

        Assert.False(result.IsSuccess);
        Assert.Equal("This driver already has a team assigned for this season.", result.Error);
    }

    [Fact]
    public async Task RaceService_MissingSeason_Fails()
    {
        await using var db = TestDb.Create();
        var result = await new RaceService(db).CreateAsync(new Race
        {
            Id = Guid.NewGuid(), Name = "GP", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow, SeasonId = Guid.NewGuid(), IsSprint = false
        });
        Assert.Null(result);
    }

    [Fact]
    public async Task RaceService_Create_CreatesBlankResultsForEveryDriverSeason()
    {
        await using var db = TestDb.Create();
        var seasonId = Guid.NewGuid();
        db.Seasons.Add(new Season { Id = seasonId, Year = 2026 });
        db.DriverSeasons.AddRange(
            new DriverSeason { Id = Guid.NewGuid(), DriverNumber = 1, DriverId = Guid.NewGuid(), TeamId = Guid.NewGuid(), SeasonId = seasonId },
            new DriverSeason { Id = Guid.NewGuid(), DriverNumber = 2, DriverId = Guid.NewGuid(), TeamId = Guid.NewGuid(), SeasonId = seasonId });
        await db.SaveChangesAsync();

        var race = new Race
        {
            Id = Guid.NewGuid(), Name = "GP", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow, SeasonId = seasonId, IsSprint = true
        };

        var created = await new RaceService(db).CreateAsync(race);

        Assert.NotNull(created);
        var results = db.DriverRaceResults.ToList();
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
    public async Task UserService_DuplicateEmail_Fails()
    {
        await using var db = TestDb.Create();
        db.Users.Add(User("same@example.com"));
        await db.SaveChangesAsync();

        var result = await new UserService(db).CreateAsync(User("same@example.com"));

        Assert.False(result.IsSuccess);
        Assert.Equal("A user with this email already exists.", result.Error);
    }

    [Fact]
    public async Task UserService_GetByGoogleId_ReturnsUser()
    {
        await using var db = TestDb.Create();
        var user = User();
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var found = await new UserService(db).GetByGoogleIdAsync(user.GoogleId);
        Assert.Equal(user.Id, found!.Id);
    }

    [Fact]
    public async Task CommunityService_MissingHost_Fails()
    {
        await using var db = TestDb.Create();
        var result = await new CommunityService(db).CreateAsync(new Community
        {
            Id = Guid.NewGuid(), Name = "F1", Description = "Fans", HostId = Guid.NewGuid(), IsPublic = true
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("Host not found.", result.Error);
    }

    [Fact]
    public async Task CommunityService_PublicGet_DoesNotExposePrivateCommunity()
    {
        await using var db = TestDb.Create();
        var host = User();
        db.Users.Add(host);
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Private", Description = "Private", HostId = host.Id,
            IsPublic = false, AccessCode = "ABC123"
        };
        db.Communities.Add(community);
        await db.SaveChangesAsync();

        var service = new CommunityService(db);
        Assert.Null(await service.GetByIdAsync(community.Id));
        Assert.Equal(community.Id, (await service.GetByAccessCodeAsync("ABC123"))!.Id);
    }

    [Fact]
    public async Task CommunityService_NonHostCannotUpdate()
    {
        await using var db = TestDb.Create();
        var host = User();
        var other = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "Description", HostId = host.Id, IsPublic = true
        };
        db.AddRange(host, other, community);
        await db.SaveChangesAsync();

        var result = await new CommunityService(db).UpdateAsync(
            other.Id, community.Id, new CommunityUpdateRequest("Changed", null, null, null));

        Assert.False(result.IsSuccess);
        Assert.Equal("You must be the community host to edit this community.", result.Error);
    }

    [Fact]
    public async Task CommunityService_PrivateUpdate_GeneratesAccessCode()
    {
        await using var db = TestDb.Create();
        var host = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "Description", HostId = host.Id, IsPublic = true
        };
        db.AddRange(host, community);
        await db.SaveChangesAsync();

        var result = await new CommunityService(db).UpdateAsync(
            host.Id, community.Id, new CommunityUpdateRequest(null, null, false, null));

        Assert.True(result.IsSuccess);
        Assert.False(result.Value!.IsPublic);
        Assert.NotNull(result.Value.AccessCode);
        Assert.Equal(6, result.Value.AccessCode!.Length);
    }

    [Fact]
    public async Task CommunityMemberService_HostCannotJoinOwnCommunity()
    {
        await using var db = TestDb.Create();
        var host = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        db.AddRange(host, community);
        await db.SaveChangesAsync();

        var result = await new CommunityMemberService(db).CreateAsync(new CommunityMember
        {
            Id = Guid.NewGuid(), CommunityId = community.Id, UserId = host.Id
        }, null);

        Assert.False(result.IsSuccess);
        Assert.Equal("Host cannot join their own community.", result.Error);
    }

    [Fact]
    public async Task CommunityMemberService_PrivateCommunityRequiresCode()
    {
        await using var db = TestDb.Create();
        var host = User();
        var member = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Private", Description = "F1", HostId = host.Id,
            IsPublic = false, AccessCode = "SECRET"
        };
        db.AddRange(host, member, community);
        await db.SaveChangesAsync();

        var service = new CommunityMemberService(db);
        var wrong = await service.CreateAsync(new CommunityMember
        {
            Id = Guid.NewGuid(), CommunityId = community.Id, UserId = member.Id
        }, "WRONG");

        Assert.False(wrong.IsSuccess);
        Assert.Equal("Incorrect access code.", wrong.Error);

        var correct = await service.CreateAsync(new CommunityMember
        {
            Id = Guid.NewGuid(), CommunityId = community.Id, UserId = member.Id
        }, "SECRET");

        Assert.True(correct.IsSuccess);
    }

    [Fact]
    public async Task CommunityMemberService_DuplicateMembership_Fails()
    {
        await using var db = TestDb.Create();
        var host = User();
        var member = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        db.AddRange(host, member, community);
        db.CommunityMembers.Add(new CommunityMember
        {
            Id = Guid.NewGuid(), CommunityId = community.Id, UserId = member.Id
        });
        await db.SaveChangesAsync();

        var result = await new CommunityMemberService(db).CreateAsync(new CommunityMember
        {
            Id = Guid.NewGuid(), CommunityId = community.Id, UserId = member.Id
        }, null);

        Assert.False(result.IsSuccess);
        Assert.Equal("User is already a member of this community.", result.Error);
    }

    [Fact]
    public async Task CommunityMemberService_IsMember_HostAndExplicitMemberAreTrue()
    {
        await using var db = TestDb.Create();
        var host = User();
        var member = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        db.AddRange(host, member, community);
        db.CommunityMembers.Add(new CommunityMember
        {
            Id = Guid.NewGuid(), CommunityId = community.Id, UserId = member.Id
        });
        await db.SaveChangesAsync();

        var service = new CommunityMemberService(db);
        Assert.True(await service.IsMemberAsync(community.Id, host.Id));
        Assert.True(await service.IsMemberAsync(community.Id, member.Id));
        Assert.False(await service.IsMemberAsync(community.Id, Guid.NewGuid()));
    }

    [Fact]
    public async Task DriverRaceResultService_CreateMissingRace_Fails()
    {
        await using var db = TestDb.Create();
        var result = await new DriverRaceResultService(db).CreateAsync(new DriverRaceResult
        {
            Id = Guid.NewGuid(), DriverSeasonId = Guid.NewGuid(), RaceId = Guid.NewGuid(),
            StartingPosition = 1, FinishingPosition = 1, StartingPositionSprint = 0,
            FinishingPositionSprint = 0, Context = ""
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("Race not found.", result.Error);
    }

    [Fact]
    public async Task RatingService_CreateMissingUser_Fails()
    {
        await using var db = TestDb.Create();
        var result = await new RatingService(db).CreateAsync(new Rating
        {
            Id = Guid.NewGuid(), UserId = Guid.NewGuid(), DriverRaceResultId = Guid.NewGuid(), Score = Score.Create(8)
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("User not found.", result.Error);
    }

    [Fact]
    public async Task RatingService_CreateMissingDriverRaceResult_Fails()
    {
        await using var db = TestDb.Create();
        var user = User();
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var result = await new RatingService(db).CreateAsync(new Rating
        {
            Id = Guid.NewGuid(), UserId = user.Id, DriverRaceResultId = Guid.NewGuid(), Score = Score.Create(8)
        });
        Assert.False(result.IsSuccess);
        Assert.Equal("Driver race result not found.", result.Error);
    }

    [Fact]
    public async Task RatingService_CreateBeforeOpenTime_Fails()
    {
        await using var db = TestDb.Create();
        var user = User();
        var season = new Season { Id = Guid.NewGuid(), Year = 2026 };
        var race = new Race
        {
            Id = Guid.NewGuid(), Name = "Future", Circuit = "Circuit", Flag = "BR",
            Date = DateTime.UtcNow.AddHours(1), SeasonId = season.Id
        };
        var drr = new DriverRaceResult
        {
            Id = Guid.NewGuid(), DriverSeasonId = Guid.NewGuid(), RaceId = race.Id,
            StartingPosition = 1, FinishingPosition = 1, StartingPositionSprint = 0,
            FinishingPositionSprint = 0, Context = ""
        };
        db.AddRange(user, season, race, drr);
        await db.SaveChangesAsync();

        var result = await new RatingService(db).CreateAsync(new Rating
        {
            Id = Guid.NewGuid(), UserId = user.Id, DriverRaceResultId = drr.Id, Score = Score.Create(8)
        });

        Assert.False(result.IsSuccess);
        Assert.Contains("Ratings for this race open at", result.Error);
    }
}
