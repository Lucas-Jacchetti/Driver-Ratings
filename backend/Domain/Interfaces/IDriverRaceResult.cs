using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Feature.DriverRaceResults.DataManipulation;

namespace backend.Domain.Interfaces;

public interface IDriverRaceResultService
{
    Task<ICollection<DriverRaceResult>> GetAllAsync();
    Task<Result<DriverRaceResult>> CreateAsync(DriverRaceResult driverRaceResult);
    Task<DriverRaceResult?> GetByIdAsync(Guid id);
    Task<DriverRaceResult?> DeleteAsync(Guid driverRaceResultId);
    Task<Result<ICollection<DriverRaceResult>>> UpdateDriverRaceResultsAsync(Guid raceId, DriverRaceResultSubmissionRequest submission);    
    Task<ICollection<DriverRaceResult>> GetByRaceIdAsync(Guid raceId);
}