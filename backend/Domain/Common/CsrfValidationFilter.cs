using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.Domain.Common;

public class CsrfValidationFilter : IActionFilter
{
    private static readonly HashSet<string> SafeMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        "GET", "HEAD", "OPTIONS", "TRACE"
    };

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var request = context.HttpContext.Request;

        if (SafeMethods.Contains(request.Method))
        {
            return;
        }

        if (!request.Cookies.ContainsKey("access_token"))
        {
            return;
        }

        var hasCookieToken = request.Cookies.TryGetValue("csrf_token", out var cookieToken);
        var hasHeaderToken = request.Headers.TryGetValue("X-CSRF-Token", out var headerToken);

        if (!hasCookieToken || !hasHeaderToken || cookieToken != headerToken)
        {
            context.Result = new Microsoft.AspNetCore.Mvc.ObjectResult(new { error = "Invalid or missing CSRF token." })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}