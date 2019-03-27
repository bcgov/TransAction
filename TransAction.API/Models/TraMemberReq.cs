using System;
using System.Collections.Generic;

namespace TransAction.API.Models
{
    public partial class TraMemberReq
    {
        public int MemberReqId { get; set; }
        public int UserId { get; set; }
        public int TeamId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }

        public virtual TraTeam Team { get; set; }
        public virtual TraUser User { get; set; }
    }
}
