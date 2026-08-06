namespace backend.Feature.Ratings.DataManipulation;
public record RaceRatingCreationDTO(
    Guid RaceId,
    ICollection<RatingCreationDTO> Ratings
);