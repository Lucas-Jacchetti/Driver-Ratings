namespace backend.Domain.Entities;

public class CommunityMember
{
    public Guid Id { get; set; }

    public Guid CommunityId { get; set; }
    public Community Community { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;   
}