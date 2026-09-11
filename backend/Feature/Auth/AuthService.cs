using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace backend.Feature.Auth;

public class AuthService : IAuthService
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    private readonly IJwtTokenGenerator _tokenGenerator;
    private readonly ILogger<AuthService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthService(
        IUserService userService,
        IConfiguration configuration,
        IJwtTokenGenerator tokenGenerator,
        ILogger<AuthService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _userService = userService;
        _configuration = configuration;
        _tokenGenerator = tokenGenerator;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<Result<AuthResult>> LoginWithGoogleAsync(string idToken)
    {
        try
        {
            var clientId = _configuration["Google:ClientId"]
                ?? throw new InvalidOperationException("Google:ClientId não configurado.");
            var httpClient = _httpClientFactory.CreateClient("google-certificates");
            var certificatesJson = await httpClient.GetStringAsync(
                "https://www.googleapis.com/oauth2/v3/certs");
            var signingKeys = new JsonWebKeySet(certificatesJson).GetSigningKeys();

            var tokenHandler = new JwtSecurityTokenHandler();
            var unvalidatedToken = tokenHandler.ReadJwtToken(idToken);
            _logger.LogInformation(
                "Google token claims received. Issuer: {Issuer}, Audience: {Audience}, KeyId: {KeyId}",
                unvalidatedToken.Issuer,
                string.Join(",", unvalidatedToken.Audiences),
                unvalidatedToken.Header.Kid);

            var principal = tokenHandler.ValidateToken(idToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = signingKeys,
                ValidateIssuer = true,
                ValidIssuers = ["https://accounts.google.com", "accounts.google.com"],
                ValidateAudience = true,
                ValidAudience = clientId,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(2)
            }, out _);

            var subject = principal.FindFirst("sub")?.Value
                ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new SecurityTokenException("Google token sem subject.");
            var payload = new GooglePayload(
                subject,
                principal.FindFirst("name")?.Value
                    ?? principal.FindFirst(ClaimTypes.Name)?.Value
                    ?? string.Empty,
                principal.FindFirst("email")?.Value
                    ?? principal.FindFirst(ClaimTypes.Email)?.Value
                    ?? string.Empty);

            return await CreateAuthResultAsync(payload);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Google certificate request timed out.");
            return Result<AuthResult>.Failure("Google authentication timed out.");
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogWarning(ex, "Invalid Google ID token.");
            return Result<AuthResult>.Failure("Invalid Google token.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Fail to validade Google ID token. Type: {ExType}", ex.GetType().Name);
            return Result<AuthResult>.Failure("Invalid Google token.");
        }
    }

    private async Task<Result<AuthResult>> CreateAuthResultAsync(GooglePayload payload)
    {
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

    private sealed record GooglePayload(string Subject, string Name, string Email);
}