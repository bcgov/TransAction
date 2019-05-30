using System;
using System.Collections.Generic;

namespace TransAction.API.Models
{
    public partial class TraRegion
    {
        public TraRegion()
        {
            TraTeam = new HashSet<TraTeam>();
            TraUser = new HashSet<TraUser>();
        }

        public int RegionId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual ICollection<TraTeam> TraTeam { get; set; }
        public virtual ICollection<TraUser> TraUser { get; set; }
    }
}
