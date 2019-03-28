using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TeamUpdateDto
    {
        public string Name { get; set; }
        public string Region { get; set; }
        public string Description { get; set; }
        public int Goal { get; set; }
        public int UserId { get; set; }
    }
}
