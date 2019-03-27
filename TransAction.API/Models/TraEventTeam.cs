using System;
using System.Collections.Generic;

namespace TransAction.API.Models
{
    public partial class TraEventTeam
    {
        public int EventTeamId { get; set; }
        public int EventId { get; set; }
        public int TeamId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }

        public virtual TraEvent Event { get; set; }
        public virtual TraTeam Team { get; set; }
    }
}
