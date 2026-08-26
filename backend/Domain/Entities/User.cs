using backend.Domain.Roles;

namespace backend.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string GoogleId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public UserRoles UserRoles { get; set; } = UserRoles.User;
}