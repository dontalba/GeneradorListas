namespace GeneradorListas.Models
{
    public class Mensajes
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Mensaje { get; set; }
        public string Usuario { get; set; }
        public string UsuarioDestino { get; set; }
        public DateTime fecha { get; set; }
    }
}
