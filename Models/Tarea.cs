namespace GeneradorListas.Models
{
    public class Tarea
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Usuario { get; set; }
        public bool Completada { get; set; }

        //nuevos
        public string Descripcion { get; set; }
        public bool Urgente { get; set; }
    }
}
