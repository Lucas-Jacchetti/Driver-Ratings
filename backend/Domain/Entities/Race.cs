namespace backend.Domain.Entities;

public class Race
{
    public const int DurationHours = 4;
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Circuit { get; set; }
    public required string Flag { get; set; }
    public DateTime Date { get; set; }

    public Guid SeasonId { get; set; }
    public Season Season { get; set; } = null!;

    public ICollection<DriverRaceResult> DriverRaceResults { get; set; } = [];
}