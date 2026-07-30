
using backend.Feature.Communities.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.CommunityMembers.DataManipulation;

public record CommunityMemberResponseDTO(
    Guid Id,
    CommunityResponseDTO Community,
    UserResponseDTO User,
    DateTime JoinedAt
);