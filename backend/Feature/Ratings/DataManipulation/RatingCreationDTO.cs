
using backend.Domain.ValueObjects;

namespace backend.Feature.Ratings.DataManipulation;

public record RatingCreationDTO(
    Guid UserId,
    Guid DriverRaceResultId,
    Score Score
);