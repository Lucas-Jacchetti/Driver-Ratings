using backend.Domain.Entities;

namespace backend.Feature.Ratings.Contracts;

public class RaceRatingSubmission
{
    public Guid UserId { get; init; }

    public Guid RaceId { get; init; }

    public ICollection<Rating> Ratings { get; init; } = [];
}