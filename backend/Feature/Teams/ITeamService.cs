using backend.Domain.Entities;

namespace backend.Feature.Teams;

public interface ITeamService
{
    Task<ICollection<Team>> GetAllAsync();
    Task<Team?> CreateAsync(string name);
}