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
        public string Region { get; set; }
        public string Description { get; set; }
        public int ProgressBar { get; set; }
        public int UserId { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraUser User { get; set; }
        public ICollection<TraEventTeam> TraEventTeam { get; set; }
        public ICollection<TraMemberReq> TraMemberReq { get; set; }
        public ICollection<TraUser> TraUser { get; set; }
    }
}
