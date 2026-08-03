using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface IDriverRaceResultService
{
    Task<ICollection<DriverRaceResult>> GetAllAsync();
    Task<Result<DriverRaceResult>> CreateAsync(DriverRaceResult driverRaceResult);
    Task<DriverRaceResult?> GetByIdAsync(Guid id);
    Task<DriverRaceResult?> DeleteAsync(Guid driverRaceResultId);
}