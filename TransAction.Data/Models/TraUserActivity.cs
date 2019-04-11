using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraUserActivity
    {
        public int UserActivityId { get; set; }
        public string Description { get; set; }
        public double Hours { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }



        public TraActivity Activity { get; set; }
        public TraUser User { get; set; }
    }
}
