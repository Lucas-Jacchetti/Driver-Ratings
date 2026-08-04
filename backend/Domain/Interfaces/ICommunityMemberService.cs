using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface ICommunityMemberService
{
    Task<ICollection<CommunityMember>> GetAllAsync();
    Task<Result<CommunityMember>> CreateAsync(CommunityMember communityMember, string? accessToken);
    Task<CommunityMember?> GetByIdAsync(Guid id);
    Task<CommunityMember?> DeleteAsync(Guid communityMemberId);
}