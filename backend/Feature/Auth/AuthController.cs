using backend.Domain.Interfaces;
using backend.Feature.Auth.DataManipulation;
using backend.Feature.Users.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle(GoogleLoginRequest request)
    {
        var result = await _service.LoginWithGoogleAsync(request.IdToken);

        if (!result.IsSuccess)
        {
            return Unauthorized(new { error = result.Error });
        }

        var response = new AuthResponseDTO(
            result.Value!.Token,
            UserMapper.ToResponse(result.Value.User)
        );

        return Ok(response);
    }
}