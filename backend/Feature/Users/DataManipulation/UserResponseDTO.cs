namespace backend.Feature.Users.DataManipulation;

public record UserResponseDTO(
    Guid Id,
    string Name,
    string Email,
    string? GoogleId,
    DateTime CreatedAt
);