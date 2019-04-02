using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class EventDto
    {
        [JsonProperty("id")]
        public int EventId { get; set; }
        public String Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description {  get; set; }
    }
}
