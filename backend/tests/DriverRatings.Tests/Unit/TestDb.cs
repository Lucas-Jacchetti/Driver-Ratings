using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace DriverRatings.Tests.Unit;

internal static class TestDb
{
    public static ApplicationDbContext Create()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }
}
