using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using GeneradorListas.Models;

namespace GeneradorListas.Pages
{
    public class IndexModel : PageModel
    {
        private readonly GeneradorListas.Models.AppDbContext _context;

        public IndexModel(GeneradorListas.Models.AppDbContext context)
        {
            _context = context;
        }

        public IList<Tarea> Tarea { get;set; } = default!;

        public async Task OnGetAsync()
        {
            Tarea = await _context.Tareas.ToListAsync();
        }
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> OnPostCompletarAsync(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null)
            {
                return NotFound();
            }

            tarea.Completada = tarea.Completada ? false : true; // Toggle completion status
            await _context.SaveChangesAsync();

            return RedirectToPage();
        }
    }
}
