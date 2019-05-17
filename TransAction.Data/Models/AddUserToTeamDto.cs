using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class AddUserToTeamDto
    {
        public int UserId { get; set; }
        public int TeamId { get; set; }
    }
}
