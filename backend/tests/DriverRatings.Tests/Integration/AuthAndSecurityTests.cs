using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using backend.Domain.Roles;

namespace DriverRatings.Tests.Integration;

[Collection("Integration")]
public class AuthAndSecurityTests : ApiTestBase
{
    public AuthAndSecurityTests(IntegrationTestFactory factory) : base(factory) { }

    [Fact]
    public async Task UserMe_Anonymous_Returns401()
    {
        await ResetAsync();
        var response = await Client().GetAsync("/api/User/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UserMe_ReturnsAuthenticatedUser()
    {
        await ResetAsync();
        var (user, token) = await Factory.CreateUserAsync("Lucas");

        var response = await Client(token).GetAsync("/api/User/me");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(user.Email, await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task AdminUserEndpoints_RegularUser_Return403()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.User);

        Assert.Equal(HttpStatusCode.Forbidden,
            (await Client(token).GetAsync("/api/User")).StatusCode);
    }

    [Fact]
    public async Task AdminUserEndpoints_Admin_Return200()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync(role: UserRoles.Admin);

        Assert.Equal(HttpStatusCode.OK,
            (await Client(token).GetAsync("/api/User")).StatusCode);
    }

    [Fact]
    public async Task InvalidJwt_Returns401()
    {
        await ResetAsync();
        var response = await Client("not-a-jwt").GetAsync("/api/User/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Logout_Authenticated_Returns204AndDeletesCookies()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync();
        var client = Client(token);

        var response = await client.PostAsync("/api/Auth/logout", null);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.True(response.Headers.TryGetValues("Set-Cookie", out var cookies));
        Assert.Contains(cookies!, c => c.Contains("access_token", StringComparison.OrdinalIgnoreCase));
        Assert.Contains(cookies!, c => c.Contains("csrf_token", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task CookieAuthentication_WithoutCsrfHeader_RejectsUnsafeRequest()
    {
        await ResetAsync();
        var (_, token) = await Factory.CreateUserAsync();
        var client = Client(token);

        // The CSRF filter only activates when an access_token cookie is present.
        // Use a cookie jar manually to simulate the browser flow.
        client.DefaultRequestHeaders.Remove("Authorization");
        client.DefaultRequestHeaders.Add("Cookie", $"access_token={token}; csrf_token=wrong");

        var response = await client.PostAsJsonAsync("/api/Community", new
        {
            name = "CSRF",
            description = "test",
            isPublic = true,
            imgUrl = (string?)null
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
