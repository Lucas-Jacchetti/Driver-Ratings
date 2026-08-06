namespace backend.Feature.Groups.Communities.DataManipulation;

public record CommunityCreationDTO(
    string Name,
    string Description,
    bool IsPublic,
    string? ImgUrl
);