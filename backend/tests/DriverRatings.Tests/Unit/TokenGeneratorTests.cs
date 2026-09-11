using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.Domain.Entities;
using backend.Domain.Roles;
using backend.Feature.Auth;

namespace DriverRatings.Tests.Unit;

public class TokenGeneratorTests
{
    [Fact]
    public void GenerateToken_ContainsIdentityAndRoleClaims()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"] = "unit-test-secret-key-with-more-than-32-characters"
            })
            .Build();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Lucas",
            Email = "lucas@example.com",
            GoogleId = "google",
            UserRoles = UserRoles.Admin
        };

        var token = new TokenGenerator(configuration).GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Equal(user.Id.ToString(), jwt.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal(user.Email, jwt.Claims.Single(c => c.Type == ClaimTypes.Email).Value);
        Assert.Equal(user.Name, jwt.Claims.Single(c => c.Type == ClaimTypes.Name).Value);
        Assert.Equal(UserRoles.Admin.ToString(), jwt.Claims.Single(c => c.Type == ClaimTypes.Role).Value);
        Assert.True(jwt.ValidTo > DateTime.UtcNow);
    }

    [Fact]
    public void GenerateToken_MissingSecret_Throws()
    {
        var configuration = new ConfigurationBuilder().Build();
        var user = new User
        {
            Id = Guid.NewGuid(), Name = "Lucas", Email = "lucas@example.com", GoogleId = "google"
        };

        Assert.Throws<InvalidOperationException>(() =>
            new TokenGenerator(configuration).GenerateToken(user));
    }
}
