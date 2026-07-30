using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configuration;

public class RatingConfiguration : IEntityTypeConfiguration<Rating>
{
    public void Configure(EntityTypeBuilder<Rating> builder)
    {
        builder.HasIndex(r => new { r.UserId, r.DriverRaceResultId }).IsUnique();

        builder.Property(r => r.Comment).HasMaxLength(1000);

        builder.OwnsOne(r => r.Score, score =>
        {
            score.Property(s => s.Value)
                .HasColumnName("Score")
                .HasPrecision(3, 1)
                .IsRequired();
        });

        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.DriverRaceResult)
            .WithMany(drr => drr.Ratings)
            .HasForeignKey(r => r.DriverRaceResultId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}