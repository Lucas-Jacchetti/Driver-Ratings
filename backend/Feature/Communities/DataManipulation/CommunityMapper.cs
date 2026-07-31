using backend.Domain.Entities;
using backend.Feature.CommunityMembers.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Communities.DataManipulation;

public static class CommunityMapper
{
    public static Community ToDomain(CommunityCreationDTO dto)
    {
        return new Community
        {
            Name = dto.Name,
            AccessCode = dto.AccessCode,
            Description = dto.Description,
            HostId = dto.HostId,
            IsPublic = dto.IsPublic,
            ImgUrl = dto.ImgUrl
        };
    }

    public static CommunityResponseDTO ToResponse(Community community)
    {
        return new CommunityResponseDTO(
            community.Id,
            community.Name,
            community.AccessCode,
            community.Description,
            UserMapper.ToSummary(community.Host),
            community.IsPublic,
            community.ImgUrl,
            community.Members
                .Select(CommunityMemberMapper.ToResponse)
                .ToList(),
            community.CreatedAt
        );
    }

    public static IEnumerable<CommunityResponseDTO> ToResponseList(IEnumerable<Community> communities)
    {
        return communities.Select(ToResponse);
    }
}