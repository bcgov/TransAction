using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{    public partial class TraTeam

    {
        public TraTeam()
        {
            TraEventTeam = new HashSet<TraEventTeam>();
            TraMemberReq = new HashSet<TraMemberReq>();
            TraUser = new HashSet<TraUser>();
        }

        public int TeamId { get; set; }
        public string Name { get; set; }
        public string Region { get; set; }
        public string Description { get; set; }
        public int Goal { get; set; }
        public int UserId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

                
        public virtual TraUser User { get; set; }
        public virtual ICollection<TraEventTeam> TraEventTeam { get; set; }
        public virtual ICollection<TraMemberReq> TraMemberReq { get; set; }
        public virtual ICollection<TraUser> TraUser { get; set; }

    }
}
