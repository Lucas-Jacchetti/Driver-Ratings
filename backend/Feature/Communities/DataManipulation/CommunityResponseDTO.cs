
using backend.Feature.CommunityMembers.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Communities.DataManipulation;

public record CommunityResponseDTO(
    Guid Id,
    string Name,
    string? AccessCode,
    string Description,
    UserSummaryDTO Host,
    bool IsPublic,
    string? ImgUrl,
    ICollection<CommunityMemberResponseDTO> Members,
    DateTime CreatedAt
);