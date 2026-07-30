namespace backend.Domain.Entities;

public class DriverSeason
{
    public Guid Id { get; set; }
    public int DriverNumber { get; set; }

    public Guid DriverId { get; set; }
    public Driver Driver { get; set; } = null!;

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public Guid SeasonId { get; set; }
    public Season Season { get; set; } = null!;

    public ICollection<DriverRaceResult> DriverRaceResults { get; set; } = [];
}