using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class RoleDto
    {
        [JsonProperty("id")]
        public int RoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
