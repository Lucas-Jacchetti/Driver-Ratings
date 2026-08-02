using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface ITeamService
{
    Task<ICollection<Team>> GetAllAsync();
    Task<Team?> CreateAsync(Team team);
    Task<Team?> GetByIdAsync(Guid Id);
}