using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface IDriverService
{
    Task<ICollection<Driver>> GetAllAsync();
    Task<Driver?> CreateAsync(Driver driver);
    Task<Driver?> GetByIdAsync(Guid id);
    Task<Driver?> DeleteAsync(Guid driverId);
}