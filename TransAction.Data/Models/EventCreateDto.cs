using System;
using System.ComponentModel.DataAnnotations;

namespace TransAction.Data.Models
{
    public class EventCreateDto
    {
        [Required]
        public String Name { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public string Description { get; set; }
        public Boolean IsActive { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
