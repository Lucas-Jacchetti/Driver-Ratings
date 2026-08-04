using backend.Feature.Users.DataManipulation;

namespace backend.Feature.Auth.DataManipulation;

public record AuthResponseDTO(
    string Token, 
    UserResponseDTO User
);