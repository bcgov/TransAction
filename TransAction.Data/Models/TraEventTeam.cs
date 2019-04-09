using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraEventTeam
    {
        public int EventTeamsId { get; set; }
        public int EventId { get; set; }
        public int TeamId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public TraEvent Event { get; set; }
        public TraTeam Team { get; set; }
    }
}
