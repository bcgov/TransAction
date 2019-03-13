using System;
using System.Collections.Generic;

namespace TransActionPractice.Models
{
    public partial class TraActivity
    {
        public TraActivity()
        {
            TraUserActivity = new HashSet<TraUserActivity>();
        }

        public int ActivityId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Intensity { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public ICollection<TraUserActivity> TraUserActivity { get; set; }
    }
}
