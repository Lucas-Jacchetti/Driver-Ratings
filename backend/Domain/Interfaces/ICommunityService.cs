using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface ICommunityService
{
    Task<PagedResult<Community>> GetAllAsync(int page, int pageSize);
    Task<Result<Community>> CreateAsync(Community community);
    Task<Community?> GetByIdAsync(Guid id);
    Task<Community?> DeleteAsync(Guid communityId);
    Task<Community?> GetByAccessCodeAsync(string accessCode);
    Task<PagedResult<Community>> GetMy(int page, int pageSize, Guid userId);

}