using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraTeam
    {
        public TraTeam()
        {
            TraEventTeam = new HashSet<TraEventTeam>();
            TraImage = new HashSet<TraImage>();
            TraMemberReq = new HashSet<TraMemberReq>();
            TraUser = new HashSet<TraUser>();
            TraUserActivity = new HashSet<TraUserActivity>();
        }

        public int TeamId { get; set; }
        public string Name { get; set; }
        public int RegionId { get; set; }
        public string Description { get; set; }
        public int Goal { get; set; }
        public int UserId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual TraRegion Region { get; set; }
        public virtual TraUser User { get; set; }
        public virtual ICollection<TraEventTeam> TraEventTeam { get; set; }
        public virtual ICollection<TraImage> TraImage { get; set; }
        public virtual ICollection<TraMemberReq> TraMemberReq { get; set; }
        public virtual ICollection<TraUser> TraUser { get; set; }
        public virtual ICollection<TraUserActivity> TraUserActivity { get; set; }


    }
}
