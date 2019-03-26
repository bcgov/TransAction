using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraMemberReq
    {
        public int MemberReqId { get; set; }
        public int UserId { get; set; }
        public int TeamId { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraTeam Team { get; set; }
        public TraUser User { get; set; }
    }
}
