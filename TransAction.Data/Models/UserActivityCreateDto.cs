using System;
using System.ComponentModel.DataAnnotations;

namespace TransAction.Data.Models
{
    public class UserActivityCreateDto
    {
        [Required(ErrorMessage = "User Activity Description Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "User Activity Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Minutes Required")]
        public int Minutes { get; set; }
        [Required(ErrorMessage = "Activity TimeStamp Required")]
        public DateTime ActivityTimestamp { get; set; }
        [Range(1, Int32.MaxValue, ErrorMessage = "User Id Required")]
        public int UserId { get; set; }
        [Range(1, Int32.MaxValue, ErrorMessage = "Activity Id Required")]
        public int ActivityId { get; set; }
        [Range(1, Int32.MaxValue, ErrorMessage = "Event Id Required")]
        public int EventId { get; set; }
        [Range(1, Int32.MaxValue, ErrorMessage = "Team Id Required")]
        public int TeamId { get; set; }
    }
}
