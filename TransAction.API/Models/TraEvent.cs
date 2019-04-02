using System;
using System.Collections.Generic;

namespace TransAction.API.Models
{
    public partial class TraEvent
    {
        public TraEvent()
        {
            TraEventTeam = new HashSet<TraEventTeam>();
            TraEventUser = new HashSet<TraEventUser>();
        }

        public int EventId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual ICollection<TraEventTeam> TraEventTeam { get; set; }
        public virtual ICollection<TraEventUser> TraEventUser { get; set; }
    }
}
