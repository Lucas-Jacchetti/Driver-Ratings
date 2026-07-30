using backend.Domain.Entities;

namespace backend.Feature.Teams.DataManipulation;

public static class TeamMapper
{
    public static TeamResponseDTO ToResponse(Team team) =>
        new(team.Id, team.Name);

    public static ICollection<TeamResponseDTO> ToResponse(IEnumerable<Team> teams) =>
        teams.Select(ToResponse).ToList();

    public static Team ToDomain(string name) =>
        new() { Name = name };
}