using backend.Domain.Entities;
using backend.Feature.DriverSeasons.DataManipulation;

namespace backend.Feature.Drivers.DataManipulation;

public static class DriverMapper
{
    public static DriverResponseDTO ToResponse(Driver driver) =>
        new(
            driver.Id,
            driver.Flag,
            driver.Name,
            driver.DriverSeasons.Select(DriverSeasonMapper.ToSummary).ToList()
        );

    public static DriverSummaryDTO ToSummary(Driver driver) =>
        new(driver.Id, driver.Name, driver.Flag);

    public static Driver ToDomain(DriverCreationDTO driverCreationDTO) =>
        new() {Flag = driverCreationDTO.Flag, Name = driverCreationDTO.Name };
}       