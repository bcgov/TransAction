using System;
using System.Collections.Generic;

namespace TransActionPractice.Models
{
    public partial class TraEventUser
    {
        public int EventUsersId { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraEvent Event { get; set; }
        public TraUser User { get; set; }
    }
}
