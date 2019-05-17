using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TopicDto
    {
        [JsonProperty("id")]
        public int TopicId { get; set; }
        public string Title { get; set; }
        public int UserId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
