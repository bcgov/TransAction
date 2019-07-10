using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace TransAction.Data.Models
{
    public class ImageDto
    {
        [JsonProperty("id")]
        public int ImageId { get; set; }

        public int? TeamId { get; set; }

        public int? UserId { get; set; }

        public string Guid { get; set; }

        public long ConcurrencyControlNumber { get; set; }
    }
}
