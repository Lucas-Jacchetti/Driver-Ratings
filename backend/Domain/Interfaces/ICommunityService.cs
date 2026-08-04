using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface ICommunityService
{
    Task<ICollection<Community>> GetAllAsync();
    Task<Result<Community>> CreateAsync(Community community);
    Task<Community?> GetByIdAsync(Guid id);
    Task<Community?> DeleteAsync(Guid communityId);
}