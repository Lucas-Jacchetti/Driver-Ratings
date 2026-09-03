namespace backend.Feature.Groups.Communities.DataManipulation;

public record CommunityUpdateRequest(
    string? Name,
    string? Description,
    bool? IsPublic,
    string? ImgUrl
);