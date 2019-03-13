using System;
using System.Collections.Generic;

namespace TransActionPractice.Models
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
        public string Description { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public ICollection<TraEventTeam> TraEventTeam { get; set; }
        public ICollection<TraEventUser> TraEventUser { get; set; }
    }
}
