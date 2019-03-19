using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraTopicMessage
    {
        public int TopicMessageId { get; set; }
        public int UserId { get; set; }
        public string Body { get; set; }
        public int TopicId { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraTopic Topic { get; set; }
        public TraUser User { get; set; }
    }
}
