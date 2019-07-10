using Microsoft.AspNetCore.Http;

namespace TransAction.Data.Models
{
    public class ImageUpdateDto
    {
        public IFormFile Data { get; set; }
    }
}
