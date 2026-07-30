namespace backend.Domain.ValueObjects;

public class Score
{
    public const decimal Minimum = 0m;
    public const decimal Maximum = 10m;

    public decimal Value { get; private set; }

    private Score()
    {
    }

    private Score(decimal value)
    {
        Value = value;
    }

    public static Score Create(decimal value)
    {
        if (value < Minimum || value > Maximum)
        {
            throw new ArgumentOutOfRangeException(nameof(value), $"Score must be between {Minimum} and {Maximum}.");
        }
        return new Score(value);
    }

    public override string ToString() => Value.ToString("0.0");

    public override bool Equals(object? obj) => obj is Score other && Value == other.Value;

    public override int GetHashCode() => Value.GetHashCode();
}