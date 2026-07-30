namespace backend.Domain.Entities;

public class DriverRaceResult
{
    public Guid Id { get; set; }

    public Guid DriverSeasonId { get; set; }
    public DriverSeason DriverSeason { get; set; } = null!;

    public Guid RaceId { get; set; }
    public Race Race { get; set; } = null!;

    public required int StartingPosition { get; set; }
    public required int FinishingPosition { get; set; }   // 0 = DNF/DNS
    public required string Context { get; set; }

    public ICollection<Rating> Ratings { get; set; } = [];
}