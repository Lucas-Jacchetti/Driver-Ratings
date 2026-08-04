namespace backend.Feature.Groups.Communities.DataManipulation;

public record CommunityCreationDTO(
    string Name,
    string Description,
    Guid HostId,
    bool IsPublic,
    string? ImgUrl
);