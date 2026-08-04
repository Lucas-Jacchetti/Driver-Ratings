using backend.Domain.Entities;
namespace backend.Feature.Users.DataManipulation;

public static class UserMapper
{
    public static UserResponseDTO ToResponse(User user) =>
        new(user.Id, user.Name, user.Email, user.CreatedAt);

    public static UserSummaryDTO ToSummary(User user) =>
        new(user.Id, user.Name);
}