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
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual TraUser User { get; set; }
        public virtual ICollection<TraTopicMessage> TraTopicMessage { get; set; }
    }
}
