using System.Net;
using System.Net.Http.Json;
using backend.Domain.Entities;
using backend.Domain.Roles;
using Microsoft.Extensions.DependencyInjection;

namespace DriverRatings.Tests.Integration;

[Collection("Integration")]
public class CrudEndpointTests : ApiTestBase
{
    public CrudEndpointTests(IntegrationTestFactory factory) : base(factory) { }

    [Fact]
    public async Task PublicReadEndpoints_ReturnOk()
    {
        await ResetAsync();
        var routes = new[]
        {
            "/api/Driver",
            "/api/Team",
            "/api/Season",
            "/api/DriverSeason",
            "/api/Race",
            "/api/DriverRaceResult",
            "/api/Community?page=1&pageSize=20",
            "/api/Rating/global?year=2026"
        };

        foreach (var route in routes)
        {
            var response = await Client().GetAsync(route);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }

    [Theory]
    [InlineData("/api/Driver")]
    [InlineData("/api/Team")]
    [InlineData("/api/Season")]
    [InlineData("/api/DriverSeason")]
    [InlineData("/api/DriverRaceResult")]
    public async Task AdminOnlyCreate_Anonymous_Returns401(string route)
    {
        await ResetAsync();
        var response = await Client().PostAsJsonAsync(route, new { });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/Driver")]
    [InlineData("/api/Team")]
    [InlineData("/api/Season")]
    [InlineData("/api/DriverSeason")]
    [InlineData("/api/DriverRaceResult")]
    public async Task AdminOnlyCreate_RegularUser_Returns403(string route)
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync();
        var response = await Client(token).PostAsJsonAsync(route, new { });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Driver_AdminCanCreateAndDelete()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);
        var name = $"Driver-{Guid.NewGuid():N}";

        var create = await Client(token).PostAsJsonAsync("/api/Driver", new { flag = "BR", name });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);

        var dto = await create.Content.ReadFromJsonAsync<DriverDto>();
        Assert.NotNull(dto);
        Assert.Equal(name, dto!.Name);

        var get = await Client().GetAsync($"/api/Driver/{dto.Id}");
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);

        var delete = await Client(token).DeleteAsync($"/api/Driver/{dto.Id}");
        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);

        Assert.Equal(HttpStatusCode.NotFound,
            (await Client().GetAsync($"/api/Driver/{dto.Id}")).StatusCode);
    }

    [Fact]
    public async Task Team_DuplicateName_ReturnsConflict()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);
        var name = $"Team-{Guid.NewGuid():N}";

        Assert.Equal(HttpStatusCode.Created,
            (await Client(token).PostAsJsonAsync("/api/Team", new { name })).StatusCode);

        var second = await Client(token).PostAsJsonAsync("/api/Team", new { name });
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task Season_InvalidYear_ReturnsBadRequest()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);

        var response = await Client(token).PostAsJsonAsync("/api/Season", new { year = 2025 });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Season_ValidYear_CanBeCreated()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);

        var response = await Client(token).PostAsJsonAsync("/api/Season", new { year = 2026 });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task MissingResources_Return404()
    {
        await ResetAsync();
        var id = Guid.NewGuid();
        Assert.Equal(HttpStatusCode.NotFound, (await Client().GetAsync($"/api/Driver/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await Client().GetAsync($"/api/Team/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await Client().GetAsync($"/api/Season/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await Client().GetAsync($"/api/Race/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await Client().GetAsync($"/api/DriverSeason/{id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await Client().GetAsync($"/api/DriverRaceResult/{id}")).StatusCode);
    }

    private sealed record DriverDto(Guid Id, string Name, string Flag, object[] DriverSeasons);
}
