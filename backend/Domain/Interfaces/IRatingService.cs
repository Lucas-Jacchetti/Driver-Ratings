using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Feature.Ratings.Contracts;
using backend.Feature.Ratings.DataManipulation;

namespace backend.Domain.Interfaces;

public interface IRatingService
{
    Task<ICollection<Rating>> GetAllAsync();
    Task<Result<Rating>> CreateAsync(Rating rating);
    Task<Rating?> GetByIdAsync(Guid id);
    Task<Rating?> DeleteAsync(Guid ratingId);
    Task<Result<ICollection<Rating>>> CreateRaceRatingsAsync(RaceRatingSubmission raceRatingSubmission);
    Task<Result<ICollection<Rating>>> UpdateRaceRatingsAsync(RaceRatingSubmission raceRatingSubmission);
    //Task<ICollection<DriverSeasonRating>> GetSeasonRatingsAsync(Guid seasonId, int year);
    //Task<ICollection<DriverSeasonRating>> GetUserRatingsAsync(Guid seasonId, Guid userId, int year);
    //Task<ICollection<DriverSeasonRating>> GetRaceRatingsAsync(Guid raceId, int year);
    //Task<ICollection<DriverSeasonRating>> GetUserRaceRatingsAsync(Guid raceId, Guid userId, int year);

    Task<ICollection<DriverSeasonRating>> GetGlobalRatingsAsync(int year, Guid? raceId);
    Task<ICollection<DriverSeasonRating>> GetUserRatingsAsync(int year, Guid userId, Guid? raceId);

}