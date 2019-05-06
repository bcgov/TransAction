using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using TransAction.Data.Helpers;

namespace TransAction.Data.Models
{
    public class EventDto
    {
        [JsonProperty("id")]
        public int EventId { get; set; }
        public String Name { get; set; }
        [JsonConverter(typeof(DateFormatConverter), "yyyy-MM-dd")]
        public DateTime StartDate { get; set; }
        [JsonConverter(typeof(DateFormatConverter), "yyyy-MM-dd")]
        public DateTime EndDate { get; set; }
        public string Description {  get; set; }
        public Boolean IsActive { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
