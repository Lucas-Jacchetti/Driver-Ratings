using backend.Domain.ValueObjects;

namespace backend.Domain.Entities;

public class Rating
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid DriverRaceResultId { get; set; }
    public DriverRaceResult DriverRaceResult { get; set; } = null!;

    public Score Score { get; set; } = null!;
    public string? Comment { get; set; }
    public DateTime RatedAt { get; set; } = DateTime.UtcNow;
}