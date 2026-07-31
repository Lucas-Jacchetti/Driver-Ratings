
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.CommunityMembers.DataManipulation;

public record CommunityMemberResponseDTO(
    Guid Id,
    Guid CommunityId,
    string Community,
    UserSummaryDTO User,
    DateTime JoinedAt
);