using backend.Domain.Entities;
namespace backend.Domain.Interfaces;

public interface IRaceService
{
    Task<ICollection<Race>> GetAllAsync();
    Task<Race?> CreateAsync(Race race);
    Task<Race?> GetByIdAsync(Guid id);
    Task<Race?> DeleteAsync(Guid raceId);
    Task<Race?> GetCurrentAsync();
}