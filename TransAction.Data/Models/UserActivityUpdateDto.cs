using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserActivityUpdateDto
    {
        public string Description { get; set; }
        public string Name { get; set; }
        public double Hours { get; set; }
        public int UserId { get; set; }
        public int ActivityId { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
