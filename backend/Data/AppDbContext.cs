using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Api.Data;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Season> Seasons => Set<Season>();
    public DbSet<DriverSeason> DriverSeasons => Set<DriverSeason>();
    public DbSet<Race> Races => Set<Race>();
    public DbSet<DriverRaceResult> DriverRaceResults => Set<DriverRaceResult>();
    public DbSet<Rating> Ratings => Set<Rating>();
    public DbSet<Community> Communities => Set<Community>();
    public DbSet<CommunityMember> CommunityMembers => Set<CommunityMember>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Aplica automaticamente todas as classes IEntityTypeConfiguration<T> do assembly
        // (as que ficam em Data/Configurations/).
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}