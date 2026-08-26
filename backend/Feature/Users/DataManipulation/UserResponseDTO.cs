using backend.Domain.Roles;

namespace backend.Feature.Users.DataManipulation;

public record UserResponseDTO(
    Guid Id,
    string Name,
    string Email,
    UserRoles Role,
    DateTime CreatedAt
);