using backend.Domain.Interfaces;
using backend.Feature.Users.DataManipulation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Users;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _service.GetAllAsync();
        return Ok(users.Select(UserMapper.ToResponse).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _service.GetByIdAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(UserMapper.ToResponse(user));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await _service.DeleteAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        return NoContent();
    }
}