using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class MessageDto
    {
        [JsonProperty("id")]
        public int TopicMessageId { get; set; }
        public int UserId { get; set; }
        public string Body { get; set; }
        public int TopicId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
