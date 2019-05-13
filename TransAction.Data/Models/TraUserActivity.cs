using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraUserActivity
    {
        public int UserActivityId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Minutes { get; set; }
        public DateTime ActivityTimestamp { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
        public int EventId { get; set; }
        public int TeamId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }



        public TraActivity Activity { get; set; }
        public TraUser User { get; set; }
        //just added this for useractivity

        public TraEvent Event { get; set; }
        public TraTeam Team { get; set; }

        //public virtual ICollection<TraTeam> TraTeam { get; set; }
        //public virtual ICollection<TraEvent> TraEvent { get; set; }


    }
}
