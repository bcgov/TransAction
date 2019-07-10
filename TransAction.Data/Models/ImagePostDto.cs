using Microsoft.AspNetCore.Http;

namespace TransAction.Data.Models
{
    public class ImagePostDto
    {
        public int? TeamId { get; set; }

        public int? UserId { get; set; }

        public IFormFile Data { get; set; }
    }
}
