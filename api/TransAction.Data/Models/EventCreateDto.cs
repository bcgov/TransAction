using System;
using System.ComponentModel.DataAnnotations;

namespace TransAction.Data.Models
{
    public class EventCreateDto
    {
        [Required(ErrorMessage = "Event Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "StartDate Required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "EndDate Required")]
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "Event Description Required")]
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}
