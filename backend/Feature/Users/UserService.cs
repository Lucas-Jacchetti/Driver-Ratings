using backend.Data;
using backend.Domain.Common;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Feature.Users;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _dbContext;

    public UserService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ICollection<User>> GetAllAsync()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);
    }

    public async Task<Result<User>> CreateAsync(User user)
    {
        var emailAlreadyUsed = await _dbContext.Users.AnyAsync(u => u.Email == user.Email);
        if (emailAlreadyUsed)
        {
            return Result<User>.Failure("A user with this email already exists.");
        }

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return Result<User>.Success(user);
    }

    public async Task<User?> DeleteAsync(Guid userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user is null)
        {
            return null;
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();

        return user;
    }
}