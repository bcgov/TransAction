using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TeamCreateDto
    {
        public string Name { get; set; }
        public int RegionId { get; set; }
        public string Description { get; set; }
        public int Goal { get; set; }
        //public int UserId { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
