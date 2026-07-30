namespace backend.Domain.Entities;

public class Team
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
}