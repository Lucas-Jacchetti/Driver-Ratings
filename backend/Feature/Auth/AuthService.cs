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
    private readonly IJwtTokenGenerator _tokenGenerator;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IUserService userService, IConfiguration configuration, IJwtTokenGenerator tokenGenerator, ILogger<AuthService> logger)
    {
        _userService = userService;
        _configuration = configuration;
        _tokenGenerator = tokenGenerator;
        _logger = logger;
    }

    public async Task<Result<AuthResult>> LoginWithGoogleAsync(string idToken)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Fail to validade Google ID token. Type: {ExType}", ex.GetType().Name);
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

        var token = _tokenGenerator.GenerateToken(user!);

        return Result<AuthResult>.Success(new AuthResult(token, user!));
    }
}