namespace backend.Feature.Users.DataManipulation;

public record UserCreationDTO(
    string Name,
    string Email,
    string? GoogleId
);