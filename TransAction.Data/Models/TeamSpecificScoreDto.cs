using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TeamSpecificScoreDto
    {
        public int score { get; set; }
        public int eventId { get; set; }
        public int teamId { get; set; }
    }
}
