using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
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
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual ICollection<TraUserActivity> TraUserActivity { get; set; }
    }
}
