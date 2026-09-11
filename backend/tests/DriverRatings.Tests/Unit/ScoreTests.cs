using backend.Domain.ValueObjects;

namespace DriverRatings.Tests.Unit;

public class ScoreTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(5)]
    [InlineData(10)]
    [InlineData(7.25)]
    public void TryCreate_ValidValue_Succeeds(decimal value)
    {
        var result = Score.TryCreate(value, out var score, out var error);

        Assert.True(result);
        Assert.NotNull(score);
        Assert.Null(error);
        Assert.Equal(value, score.Value);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-0.01)]
    [InlineData(10.01)]
    [InlineData(11)]
    public void TryCreate_InvalidValue_Fails(decimal value)
    {
        var result = Score.TryCreate(value, out var score, out var error);

        Assert.False(result);
        Assert.Null(score);
        Assert.Equal("Score must be between 0 and 10.", error);
    }

    [Fact]
    public void Create_InvalidValue_Throws()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => Score.Create(10.01m));
    }

    [Theory]
    [InlineData(0, "0.0")]
    [InlineData(7, "7.0")]
    [InlineData(9.75, "9.8")]
    public void ToString_FormatsToOneDecimalPlace(decimal value, string expected)
    {
        Assert.Equal(expected, Score.Create(value).ToString());
    }

    [Fact]
    public void SameValue_IsEqual()
    {
        Assert.Equal(Score.Create(8.5m), Score.Create(8.5m));
        Assert.NotEqual(Score.Create(8.5m), Score.Create(8.4m));
    }
}
