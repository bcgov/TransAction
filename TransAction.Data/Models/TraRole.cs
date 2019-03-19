using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{    public partial class TraRole
    {
        public TraRole()
        {
            TraUser = new HashSet<TraUser>();
        }

        public int RoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public ICollection<TraUser> TraUser { get; set; }
    }
}
