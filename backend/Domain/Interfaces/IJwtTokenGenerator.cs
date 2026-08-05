using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}