namespace backend.Feature.Communities.DataManipulation;

public record CommunityCreationDTO(
    string Name,
    string? AccessCode,
    string Description,
    Guid HostId,
    bool IsPublic,
    string? ImgUrl
);