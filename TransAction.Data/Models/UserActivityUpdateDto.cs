using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserActivityUpdateDto
    {
        [Required(ErrorMessage = "User Activity Description Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "User Activity Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Minutes Required")]
        public int Minutes { get; set; }
        [Required(ErrorMessage = "Activity TimeStamp Required")]
        public DateTime ActivityTimestamp { get; set; }
        [Required(ErrorMessage = "User Id Required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Activity Id Required")]
        public int ActivityId { get; set; }
        [Required(ErrorMessage = "Event Id Required")]
        public int EventId { get; set; }
        [Required(ErrorMessage = "Team Id Required")]
        public int TeamId { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
