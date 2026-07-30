using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configuration;

public class DriverSeasonConfiguration : IEntityTypeConfiguration<DriverSeason>
{
    public void Configure(EntityTypeBuilder<DriverSeason> builder)
    {
        builder.HasIndex(ds => new { ds.DriverId, ds.SeasonId }).IsUnique();

        builder.Property(ds => ds.DriverNumber).IsRequired();

        builder.HasOne(ds => ds.Driver)
            .WithMany(d => d.DriverSeasons)
            .HasForeignKey(ds => ds.DriverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ds => ds.Team)
            .WithMany()
            .HasForeignKey(ds => ds.TeamId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ds => ds.Season)
            .WithMany(s => s.DriverSeasons)
            .HasForeignKey(ds => ds.SeasonId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}