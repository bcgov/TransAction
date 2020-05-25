using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class ActivityUpdateDto
    {
        [Required(ErrorMessage = "Activity name required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Activty description required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Invalid Intensity Value, Range: 1 - 100")]
        public int Intensity { get; set; }
        [Required(ErrorMessage = "Concurrency Control Number is required")]
        public long ConcurrencyControlNumber { get; set; }
    }
}
