using System.Runtime.CompilerServices;
using backend.Domain.Common;
using backend.Domain.Entities;

namespace backend.Domain.Interfaces;

public interface IUserService
{
    Task<ICollection<User>> GetAllAsync();
    Task<Result<User>> CreateAsync(User user);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> DeleteAsync(Guid userId);
    Task<User?> GetByGoogleIdAsync(string googleId);
}