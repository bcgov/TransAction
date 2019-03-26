using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraTopic
    {
        public TraTopic()
        {
            TraTopicMessage = new HashSet<TraTopicMessage>();
        }

        public int TopicId { get; set; }
        public string Title { get; set; }
        public int UserId { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraUser User { get; set; }
        public ICollection<TraTopicMessage> TraTopicMessage { get; set; }
    }
}
