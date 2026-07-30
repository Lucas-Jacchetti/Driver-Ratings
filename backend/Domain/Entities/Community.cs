namespace backend.Domain.Entities;

public class Community
{
    public Guid Id { get; set; }
    public Guid HostId { get; set; }
    public User Host { get; set; } = null!;
    public bool IsPublic { get; set; }
    public string? ImgUrl { get; set; }
    public ICollection<CommunityMember> Members { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}