using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraEvent
    {
        public TraEvent()
        {
            TraEventTeam = new HashSet<TraEventTeam>();
            TraEventUser = new HashSet<TraEventUser>();
            TraUserActivity = new HashSet<TraUserActivity>();
        }

        public int EventId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? IsActive { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual ICollection<TraEventTeam> TraEventTeam { get; set; }
        public virtual ICollection<TraEventUser> TraEventUser { get; set; }
        public virtual ICollection<TraUserActivity> TraUserActivity { get; set; }
    }
}
