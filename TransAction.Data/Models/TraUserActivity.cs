using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraUserActivity
    {
        public int UserActivityId { get; set; }
        public string Description { get; set; }
        public double Hours { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraActivity Activity { get; set; }
        public TraUser User { get; set; }
    }
}
