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
        if (!TryCreate(value, out var score, out var error))
        {
            throw new ArgumentOutOfRangeException(nameof(value), error);
        }
        return score!;
    }

    public static bool TryCreate(decimal value, out Score? score, out string? error)
    {
        if (value < Minimum || value > Maximum)
        {
            score = null;
            error = $"Score must be between {Minimum} and {Maximum}.";
            return false;
        }

        score = new Score(value);
        error = null;
        return true;
    }

    public override string ToString() => Value.ToString("0.0");

    public override bool Equals(object? obj) => obj is Score other && Value == other.Value;

    public override int GetHashCode() => Value.GetHashCode();
}