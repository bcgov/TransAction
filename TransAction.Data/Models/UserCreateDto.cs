using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserCreateDto
    {
        [Required(ErrorMessage = "Username Required")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Directory Required")]
        public string Directory { get; set; }
        [Required(ErrorMessage = "Guid Required")]
        public string Guid { get; set; }
        [Required(ErrorMessage = "Region Required")]
        public int RegionId { get; set; }
        [Required(ErrorMessage = "Fname Required")]
        public string Fname { get; set; }
        [Required(ErrorMessage = "Lname Required")]
        public string Lname { get; set; }
        [Required(ErrorMessage = "Description Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Email Required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Role Id Required")]
        public int RoleId { get; set; }
        public int? TeamId { get; set; }
        public bool IsFreeAgent { get; set; }
    }
}
