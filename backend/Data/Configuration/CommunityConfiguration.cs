using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configuration;
public class CommunityConfiguration : IEntityTypeConfiguration<Community>
{
    public void Configure(EntityTypeBuilder<Community> builder)
    {
        builder.Property(c => c.Name).IsRequired().HasMaxLength(150);
        builder.Property(c => c.Description).HasMaxLength(500);
        builder.Property(c => c.ImgUrl).HasMaxLength(500);
        builder.Property(c => c.AccessCode).HasMaxLength(20);

        // Único apenas entre comunidades privadas -- públicas não usam código.
        builder.HasIndex(c => c.AccessCode)
            .IsUnique()
            .HasFilter("\"AccessCode\" IS NOT NULL");

        builder.HasOne(c => c.Host)
            .WithMany()
            .HasForeignKey(c => c.HostId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}