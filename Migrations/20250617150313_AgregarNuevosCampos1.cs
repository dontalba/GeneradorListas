using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeneradorListas.Migrations
{
    /// <inheritdoc />
    public partial class AgregarNuevosCampos1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Tareas",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "Urgente",
                table: "Tareas",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Tareas");

            migrationBuilder.DropColumn(
                name: "Urgente",
                table: "Tareas");
        }
    }
}
