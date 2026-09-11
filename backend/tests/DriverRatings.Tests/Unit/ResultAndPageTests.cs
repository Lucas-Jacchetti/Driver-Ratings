using backend.Domain.Common;

namespace DriverRatings.Tests.Unit;

public class ResultAndPageTests
{
    [Fact]
    public void SuccessResult_HasValueAndNoError()
    {
        var result = Result<int>.Success(42);
        Assert.True(result.IsSuccess);
        Assert.Equal(42, result.Value);
        Assert.Null(result.Error);
    }

    [Fact]
    public void FailureResult_HasErrorAndNoValue()
    {
        var result = Result<int?>.Failure("invalid");
        Assert.False(result.IsSuccess);
        Assert.Null(result.Value);
        Assert.Equal("invalid", result.Error);
    }

    [Fact]
    public void PagedResult_CalculatesTotalPages()
    {
        var result = new PagedResult<int>(new[] { 1, 2, 3 }, 10, 2, 3);
        Assert.Equal(10, result.TotalCount);
        Assert.Equal(2, result.Page);
        Assert.Equal(3, result.PageSize);
        Assert.Equal(4, result.TotalPages);
    }
}
