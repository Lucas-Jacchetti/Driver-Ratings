using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;

namespace backend.Feature.Auth;

public class AuthService : IAuthService
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthService(IUserService userService, IConfiguration configuration)
    {
        _userService = userService;
        _configuration = configuration;
    }

    public async Task<Result<AuthResult>> LoginWithGoogleAsync(string idToken)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
        }
        catch (InvalidJwtException)
        {
            return Result<AuthResult>.Failure("Invalid Google token.");
        }

        var user = await _userService.GetByGoogleIdAsync(payload.Subject);

        if (user is null)
        {
            var newUser = new User
            {
                Name = payload.Name,
                Email = payload.Email,
                GoogleId = payload.Subject
            };

            var creationResult = await _userService.CreateAsync(newUser);
            if (!creationResult.IsSuccess)
            {
                return Result<AuthResult>.Failure(creationResult.Error!);
            }

            user = creationResult.Value;
        }

        var token = GenerateJwt(user!);

        return Result<AuthResult>.Success(new AuthResult(token, user!));
    }

    private string GenerateJwt(User user)
    {
        var jwtSecret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret não configurado.");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}