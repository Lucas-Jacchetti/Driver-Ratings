using backend.Domain.Interfaces;
using backend.Feature.Users.DataManipulation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Feature.Users;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    public UserController(IUserService service)
    {
        _service = service;
    }

    [Authorize] //admin
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _service.GetAllAsync();
        return Ok(users.Select(UserMapper.ToResponse).ToList());
    }

    [Authorize] //admin
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

    [Authorize] //admin
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