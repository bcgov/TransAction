using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserScoreDto
    {
        public int Score { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
    }
}
