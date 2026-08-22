namespace backend.Domain.Entities;

public class Driver
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Flag { get; set; }
    public ICollection<DriverSeason> DriverSeasons { get; set; } = [];
    
}