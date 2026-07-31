using backend.Domain.ValueObjects;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Ratings.DataManipulation;

public record RatingSummaryDTO(
    Guid Id, 
    UserSummaryDTO User, 
    decimal Score, 
    DateTime RatedAt
);