using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class ActivityCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Intensity { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
