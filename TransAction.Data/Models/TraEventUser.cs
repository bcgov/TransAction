using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraEventUser
    {
        public int EventUserId { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual TraEvent Event { get; set; }
        public virtual TraUser User { get; set; }
    }
}
