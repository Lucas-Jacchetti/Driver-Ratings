using backend.Data;
using backend.Domain.Entities;
using backend.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace backend.Feature.Drivers;

public class DriverService : IDriverService
{
    private readonly ApplicationDbContext _dbContext;

    public DriverService(ApplicationDbContext db)
    {
        _dbContext = db;
    }

    public async Task<Driver?> CreateAsync(Driver driver)
    {
        _dbContext.Drivers.Add(driver);
        await _dbContext.SaveChangesAsync();

        return await GetByIdAsync(driver.Id);
    }

    public async Task<Driver?> DeleteAsync(Guid driverId)
    {
        var driver = await _dbContext.Drivers.FindAsync(driverId);
        if (driver is null)
        {
            return null;
        }

        _dbContext.Drivers.Remove(driver);
        await _dbContext.SaveChangesAsync();

        return driver;
    }

    public async Task<ICollection<Driver>> GetAllAsync()
    {
        return await _dbContext.Drivers
            .Include(d => d.DriverSeasons)
            .ToListAsync();
    }

    public async Task<Driver?> GetByIdAsync(Guid id)
    {
        return await _dbContext.Drivers
            .Include(d => d.DriverSeasons)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}