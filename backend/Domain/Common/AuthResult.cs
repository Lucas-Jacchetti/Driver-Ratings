using backend.Domain.Entities;

namespace backend.Domain.Common;

public record AuthResult(
    string Token, 
    User User
);