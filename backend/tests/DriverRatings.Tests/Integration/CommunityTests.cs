using System.Net;
using System.Net.Http.Json;
using backend.Domain.Entities;
using backend.Domain.Roles;
using Microsoft.Extensions.DependencyInjection;

namespace DriverRatings.Tests.Integration;

[Collection("Integration")]
public class CommunityTests : ApiTestBase
{
    public CommunityTests(IntegrationTestFactory factory) : base(factory) { }

    [Fact]
    public async Task Anonymous_MyCommunities_Returns401()
    {
        await ResetAsync();
        Assert.Equal(HttpStatusCode.Unauthorized,
            (await Client().GetAsync("/api/Community/my")).StatusCode);
    }

    [Fact]
    public async Task UserCanCreatePublicCommunity()
    {
        await ResetAsync();
        var (user, token) = await Factory.CreateUserAsync();

        var response = await Client(token).PostAsJsonAsync("/api/Community", new
        {
            name = "Public F1",
            description = "F1 fans",
            isPublic = true,
            imgUrl = (string?)null
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Contains("Public F1", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task UserCanCreatePrivateCommunity_AndGetItByCode()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync();

        var create = await Client(token).PostAsJsonAsync("/api/Community", new
        {
            name = "Private F1",
            description = "Private fans",
            isPublic = false,
            imgUrl = (string?)null
        });

        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var body = await create.Content.ReadAsStringAsync();
        Assert.Contains("accessCode", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task PublicCommunity_GetById_Returns200_PrivateReturns404()
    {
        await ResetAsync();
        var host = User();
        var publicCommunity = new Community
        {
            Id = Guid.NewGuid(), Name = "Public", Description = "Public", HostId = host.Id, IsPublic = true
        };
        var privateCommunity = new Community
        {
            Id = Guid.NewGuid(), Name = "Private", Description = "Private", HostId = host.Id,
            IsPublic = false, AccessCode = "ABC123"
        };
        await Factory.SeedAsync(host, publicCommunity, privateCommunity);

        Assert.Equal(HttpStatusCode.OK,
            (await Client().GetAsync($"/api/Community/{publicCommunity.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound,
            (await Client().GetAsync($"/api/Community/{privateCommunity.Id}")).StatusCode);
    }

    [Fact]
    public async Task UserCanJoinPublicCommunity_AndLeave()
    {
        await ResetAsync();
        var host = User();
        var (member, token) = await Factory.CreateUserAsync("Member");
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Public", Description = "F1", HostId = host.Id, IsPublic = true
        };
        await Factory.SeedAsync(host, community);

        var join = await Client(token).PostAsJsonAsync("/api/CommunityMember", new
        {
            communityId = community.Id,
            accessToken = (string?)null
        });
        Assert.Equal(HttpStatusCode.Created, join.StatusCode);

        var leave = await Client(token).DeleteAsync($"/api/CommunityMember/{community.Id}/members/me");
        Assert.Equal(HttpStatusCode.NoContent, leave.StatusCode);
    }

    [Fact]
    public async Task UserCannotJoinPrivateCommunityWithWrongCode()
    {
        await ResetAsync();
        var host = User();
        var (_, token) = await Factory.CreateUserAsync("Member");
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Private", Description = "F1", HostId = host.Id,
            IsPublic = false, AccessCode = "SECRET"
        };
        await Factory.SeedAsync(host, community);

        var response = await Client(token).PostAsJsonAsync("/api/CommunityMember", new
        {
            communityId = community.Id,
            accessToken = "WRONG"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("Incorrect access code", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task UserCannotJoinOwnCommunity()
    {
        await ResetAsync();
        var (host, token) = await Factory.CreateUserAsync();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        await Factory.SeedAsync(community);

        var response = await Client(token).PostAsJsonAsync("/api/CommunityMember", new
        {
            communityId = community.Id,
            accessToken = (string?)null
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task NonHostCannotUpdateCommunity()
    {
        await ResetAsync();
        var (host, _) = await Factory.CreateUserAsync("Host");
        var (_, token) = await Factory.CreateUserAsync("Other");
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        await Factory.SeedAsync(community);

        var response = await Client(token).PatchAsJsonAsync($"/api/Community/{community.Id}", new
        {
            name = "Changed",
            description = (string?)null,
            isPublic = (bool?)null,
            imgUrl = (string?)null
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task HostCanMakeCommunityPrivate()
    {
        await ResetAsync();
        var (host, token) = await Factory.CreateUserAsync("Host");
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        await Factory.SeedAsync(community);

        var response = await Client(token).PatchAsJsonAsync($"/api/Community/{community.Id}", new
        {
            name = (string?)null,
            description = (string?)null,
            isPublic = false,
            imgUrl = (string?)null
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("accessCode", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task CommunityRatings_NonMember_Returns403()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync("Other");
        var host = User();
        var community = new Community
        {
            Id = Guid.NewGuid(), Name = "Community", Description = "F1", HostId = host.Id, IsPublic = true
        };
        await Factory.SeedAsync(host, community);

        var response = await Client(token).GetAsync(
            $"/api/Rating/community/{community.Id}?year=2026");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
