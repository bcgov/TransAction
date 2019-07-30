using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class EventUpdateDto
    {
        [Required(ErrorMessage = "Event Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Event Start Date Required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Event End Date Required")]
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "Event Description Required")]
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}

