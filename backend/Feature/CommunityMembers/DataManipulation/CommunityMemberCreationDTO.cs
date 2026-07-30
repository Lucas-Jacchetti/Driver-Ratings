namespace backend.Feature.CommunityMembers.DataManipulation;

public record CommunityMemberCreationDTO(
    Guid CommunityId,
    Guid UserId
);