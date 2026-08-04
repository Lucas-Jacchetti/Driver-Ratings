using System.Security.Cryptography;
using backend.Domain.Entities;
using backend.Feature.Groups.CommunityMembers.DataManipulation;
using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Groups.Communities.DataManipulation;

public static class CommunityMapper
{
    public static Community ToDomain(CommunityCreationDTO dto)
    {
        return new Community
        {
            Name = dto.Name,
            AccessCode = GenerateCode(dto.IsPublic),
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

    public static string? GenerateCode(bool isPublic)
    {
        int length = 6;
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        if (isPublic)
        {
            return null;
        }
        
        return new string(
            Enumerable.Range(0, length)
                .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
                .ToArray()
        );
    }
}