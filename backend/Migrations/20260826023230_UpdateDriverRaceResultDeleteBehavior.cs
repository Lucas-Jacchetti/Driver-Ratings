using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDriverRaceResultDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DriverRaceResults_Races_RaceId",
                table: "DriverRaceResults");

            migrationBuilder.AddForeignKey(
                name: "FK_DriverRaceResults_Races_RaceId",
                table: "DriverRaceResults",
                column: "RaceId",
                principalTable: "Races",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DriverRaceResults_Races_RaceId",
                table: "DriverRaceResults");

            migrationBuilder.AddForeignKey(
                name: "FK_DriverRaceResults_Races_RaceId",
                table: "DriverRaceResults",
                column: "RaceId",
                principalTable: "Races",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
