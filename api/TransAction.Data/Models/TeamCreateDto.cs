using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class TeamCreateDto
    {
        [Required(ErrorMessage = "Team Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Region Id Required")]
        public int RegionId { get; set; }
        [Required(ErrorMessage = "Team Description Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Team Goal Required")]
        public int Goal { get; set; }
    }
}
