﻿
using Microsoft.EntityFrameworkCore;
namespace GeneradorListas.Models
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tarea> Tareas { get; set; }
    }
}
