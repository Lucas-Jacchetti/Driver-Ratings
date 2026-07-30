using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configuration;

public class RaceConfiguration : IEntityTypeConfiguration<Race>
{
    public void Configure(EntityTypeBuilder<Race> builder)
    {
        builder.Property(r => r.Name).IsRequired().HasMaxLength(150);
        builder.Property(r => r.Circuit).IsRequired().HasMaxLength(150);

        builder.HasOne(r => r.Season)
            .WithMany(s => s.Races)
            .HasForeignKey(r => r.SeasonId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}