namespace backend.Domain.Entities;

public class Season
{
    public Guid Id { get; set; }
    public int Year { get; set; }

    public ICollection<Race> Races { get; set; } = [];
    public ICollection<DriverSeason> DriverSeasons { get; set; } = [];
}