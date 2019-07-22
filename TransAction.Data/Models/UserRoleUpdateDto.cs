using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserRoleUpdateDto
    {
        [Required(ErrorMessage = "UserId Required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "RoleId Required")]
        public int RoleId { get; set; }
    }
}
