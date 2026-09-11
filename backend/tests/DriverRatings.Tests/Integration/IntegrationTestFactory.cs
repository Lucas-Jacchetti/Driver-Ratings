using backend.Data;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Domain.Roles;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace DriverRatings.Tests.Integration;

public sealed class IntegrationTestFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string JwtSecret =
        "driver-ratings-integration-secret-key-2026-long-enough";

    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:17-alpine")
        .WithDatabase("driver_ratings_test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();

        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.EnsureCreatedAsync();
    }

    public new async Task DisposeAsync()
    {
        await _postgres.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("Jwt:Secret", JwtSecret);
        builder.UseSetting("ConnectionStrings:DefaultConnection", _postgres.GetConnectionString());

        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = _postgres.GetConnectionString(),
                ["Jwt:Secret"] = JwtSecret,
                ["Cors:AllowedOrigins:0"] = "http://localhost:4200"
            });
        });
    }

    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
    }

    public async Task<(User User, string Token)> CreateUserAsync(
        string name = "Test User",
        UserRoles role = UserRoles.User)
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = name,
            Email = $"{Guid.NewGuid():N}@example.com",
            GoogleId = $"google-{Guid.NewGuid():N}",
            UserRoles = role
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var generator = scope.ServiceProvider.GetRequiredService<IJwtTokenGenerator>();
        return (user, generator.GenerateToken(user));
    }

    public async Task SeedAsync(params object[] entities)
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.AddRange(entities);
        await db.SaveChangesAsync();
    }

}

[CollectionDefinition("Integration", DisableParallelization = true)]
public sealed class IntegrationCollection : ICollectionFixture<IntegrationTestFactory>
{
}
