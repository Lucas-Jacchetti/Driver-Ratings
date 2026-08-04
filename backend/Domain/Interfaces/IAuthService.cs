using backend.Domain.Common;

namespace backend.Domain.Interfaces;

public interface IAuthService
{
    Task<Result<AuthResult>> LoginWithGoogleAsync(string idToken);
}