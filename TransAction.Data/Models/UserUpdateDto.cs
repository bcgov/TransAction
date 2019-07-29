using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserUpdateDto
    {
        [Required(ErrorMessage = "UserName Required")]
        public string Username { get; set; }
        [Required(ErrorMessage = "RegionId Required")]
        public int RegionId { get; set; }
        [Required(ErrorMessage = "User's First Name Required")]
        public string Fname { get; set; }
        [Required(ErrorMessage = "User's Last Name Required")]
        public string Lname { get; set; }
        [Required(ErrorMessage = "Description Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Email Required")]
        public string Email { get; set; }
        public int RoleId { get; set; }
        public int? TeamId { get; set; }
        public bool IsFreeAgent { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
