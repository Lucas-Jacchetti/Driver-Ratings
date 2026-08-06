using backend.Domain.Entities;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Groups.CommunityMembers.DataManipulation;

public static class CommunityMemberMapper
{
    public static CommunityMember ToDomain(CommunityMemberCreationDTO dto, Guid userId)
    {
        return new CommunityMember
        {
            CommunityId = dto.CommunityId,
            UserId = userId
        };
    }

    public static CommunityMemberResponseDTO ToResponse(CommunityMember member)
    {
        return new CommunityMemberResponseDTO(
            member.Id,
            member.CommunityId,
            member.Community.Name,
            UserMapper.ToSummary(member.User),
            member.JoinedAt
        );
    }

    public static IEnumerable<CommunityMemberResponseDTO> ToResponseList(IEnumerable<CommunityMember> members)
    {
        return members.Select(ToResponse);
    }
}