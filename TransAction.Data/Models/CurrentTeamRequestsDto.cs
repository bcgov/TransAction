using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class CurrentTeamRequestsDto
    {
        public int UserId { get; set; }
        public int TeamId { get; set; }
        public Boolean IsActive { get; set; }
    }
}
