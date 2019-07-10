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
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual TraTopic Topic { get; set; }
        public virtual TraUser User { get; set; }
    }
}
