using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface IRatingService
{
    Task<ICollection<Rating>> GetAllAsync();
    Task<Result<Rating>> CreateAsync(Rating rating);
    Task<Rating?> GetByIdAsync(Guid id);
    Task<Rating?> DeleteAsync(Guid ratingId);
    Task<Result<ICollection<Rating>>> CreateRaceRatingsAsync();
}