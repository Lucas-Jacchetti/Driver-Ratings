
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Groups.CommunityMembers.DataManipulation;

public record CommunityMemberResponseDTO(
    Guid Id,
    Guid CommunityId,
    string Community,
    UserSummaryDTO User,
    DateTime JoinedAt
);