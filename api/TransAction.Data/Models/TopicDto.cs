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
        public DateTime LastMessageTimestamp { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public long ConcurrencyControlNumber { get; set; }
        [JsonProperty("messages")]
        public List<MessageDto> TraTopicMessage { get; set; }
        public int PostCount { get; set; }
        public string UserName { get; set; }

        public TopicDto()
        {
            TraTopicMessage = new List<MessageDto>();
        }
    }
}
