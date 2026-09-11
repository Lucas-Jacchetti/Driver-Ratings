using System.Net.Http.Headers;
using backend.Data;
using backend.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace DriverRatings.Tests.Integration;

public abstract class ApiTestBase
{
    protected IntegrationTestFactory Factory { get; }

    protected ApiTestBase(IntegrationTestFactory factory)
    {
        Factory = factory;
    }

    protected async Task ResetAsync() => await Factory.ResetDatabaseAsync();

    protected HttpClient Client(string? token = null)
    {
        var client = Factory.CreateClient(new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = true
        });

        if (token is not null)
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

        return client;
    }

    protected static User User(Guid? id = null) => new()
    {
        Id = id ?? Guid.NewGuid(),
        Name = "Test User",
        Email = $"{Guid.NewGuid():N}@example.com",
        GoogleId = $"google-{Guid.NewGuid():N}"
    };

    protected static Driver Driver(Guid? id = null, string name = "Test Driver") => new()
    {
        Id = id ?? Guid.NewGuid(),
        Name = name,
        Flag = "BR"
    };

    protected static Team Team(Guid? id = null, string name = "Test Team") => new()
    {
        Id = id ?? Guid.NewGuid(),
        Name = name
    };
}
