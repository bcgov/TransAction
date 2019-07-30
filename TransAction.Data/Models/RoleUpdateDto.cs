using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class RoleUpdateDto
    {
        [Required(ErrorMessage = "Role Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Role Description Required")]
        public string Description { get; set; }
    }
}
