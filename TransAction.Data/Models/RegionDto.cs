using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class RegionDto
    {
        [JsonProperty("id")]
        public int RegionId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
