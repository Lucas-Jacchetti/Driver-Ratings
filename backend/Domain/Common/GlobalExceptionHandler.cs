using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace backend.Common;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, message) = MapException(exception);

        _logger.LogError(exception, "Unhandled exception on {Path}", httpContext.Request.Path);

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(
            new { error = message },
            cancellationToken);

        return true;
    }

    private static (int StatusCode, string Message) MapException(Exception exception) => exception switch
    {
        ArgumentOutOfRangeException or ArgumentException =>
            (StatusCodes.Status400BadRequest, exception.Message),

        DbUpdateException dbEx when IsForeignKeyViolation(dbEx) =>
            (StatusCodes.Status409Conflict,
                "This item can't be deleted or saved because it's linked to other records."),

        DbUpdateException dbEx when IsUniqueViolation(dbEx) =>
            (StatusCodes.Status409Conflict,
                "A record with these values already exists."),

        DbUpdateException =>
            (StatusCodes.Status400BadRequest, "There was a problem saving the data."),

        _ =>
            (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
    };

    private static bool IsForeignKeyViolation(DbUpdateException ex) =>
        ex.InnerException?.Message.Contains(
            "violates foreign key constraint", StringComparison.OrdinalIgnoreCase) == true;

    private static bool IsUniqueViolation(DbUpdateException ex) =>
        ex.InnerException?.Message.Contains(
            "duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) == true;
}