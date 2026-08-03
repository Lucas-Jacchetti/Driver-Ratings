using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface ISeasonService
{
    Task<ICollection<Season>> GetAllAsync();
    Task<Season?> CreateAsync(Season race);
    Task<Season?> GetByIdAsync(Guid id);
    Task<Season?> DeleteAsync(Guid seasonId);
}