namespace backend.Feature.Groups.CommunityMembers.DataManipulation;

public record CommunityMemberCreationDTO(
    Guid CommunityId,
    string? AccessToken
);