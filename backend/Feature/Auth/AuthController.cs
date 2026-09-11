using backend.Domain.Interfaces;
using backend.Feature.Auth.DataManipulation;
using backend.Feature.Users.DataManipulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Feature.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;
    private static readonly CookieOptions CookiePath = new() { Path = "/" };

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    //[EnableRateLimiting("google-login")]
    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle(GoogleLoginRequest request)
    {
        var result = await _service.LoginWithGoogleAsync(request.IdToken);

        if (!result.IsSuccess)
        {
            return Unauthorized(new { error = result.Error });
        }

        SetAuthCookies(result.Value!.Token);

        return Ok(UserMapper.ToResponse(result.Value.User));
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token", CookiePath);
        Response.Cookies.Delete("csrf_token", CookiePath);
        return NoContent();
    }

    

    private void SetAuthCookies(string token)
    {
        var expires = DateTimeOffset.UtcNow.AddDays(7);
        var isSecure = Request.IsHttps;
        var sameSite = isSecure ? SameSiteMode.None : SameSiteMode.Lax;

        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = isSecure,
            SameSite = sameSite,
            Expires = expires,
            Path = "/"
        });

        Response.Cookies.Append("csrf_token", Guid.NewGuid().ToString("N"), new CookieOptions
        {
            HttpOnly = false,
            Secure = isSecure,
            SameSite = sameSite,
            Expires = expires,
            Path = "/"
        });
    }
}