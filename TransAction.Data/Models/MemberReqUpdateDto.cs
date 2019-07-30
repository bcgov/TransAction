using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class MemberReqUpdateDto
    {
        [Required(ErrorMessage = "User Id Required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Team Id Required")]
        public int TeamId { get; set; }
        public bool IsActive { get; set; }
        [Required(ErrorMessage = "Concurrency Control Number Required")]
        public long ConcurrencyControlNumber { get; set; }
    }
}
