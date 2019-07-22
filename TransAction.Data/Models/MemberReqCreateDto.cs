using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class MemberReqCreateDto
    {
        [Required(ErrorMessage = "User Id required for member request")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Team Id required for member request")]
        public int TeamId { get; set; }
    }
}
