using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface IDriverSeasonService
{
    Task<ICollection<DriverSeason>> GetAllAsync();
    Task<Result<DriverSeason>> CreateAsync(DriverSeason driverSeason);
    Task<DriverSeason?> GetByIdAsync(Guid id);
    Task<DriverSeason?> DeleteAsync(Guid driverSeasonId);
}