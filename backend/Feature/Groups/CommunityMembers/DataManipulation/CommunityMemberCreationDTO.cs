namespace backend.Feature.Groups.CommunityMembers.DataManipulation;

public record CommunityMemberCreationDTO(
    Guid CommunityId,
    Guid UserId,
    string? AccessToken
);