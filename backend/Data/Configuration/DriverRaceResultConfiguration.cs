using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configuration;

public class DriverRaceResultConfiguration : IEntityTypeConfiguration<DriverRaceResult>
{
    public void Configure(EntityTypeBuilder<DriverRaceResult> builder)
    {
        builder.HasIndex(r => new { r.DriverSeasonId, r.RaceId }).IsUnique();

        builder.Property(r => r.Context).IsRequired().HasMaxLength(500);

        builder.HasOne(r => r.DriverSeason)
            .WithMany(ds => ds.DriverRaceResults)
            .HasForeignKey(r => r.DriverSeasonId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Race)
            .WithMany(race => race.DriverRaceResults)
            .HasForeignKey(r => r.RaceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}