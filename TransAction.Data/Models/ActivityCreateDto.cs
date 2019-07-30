using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class ActivityCreateDto
    {
        [Required(ErrorMessage = "Activity name required/empty.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Activity description required/empty.")]
        public string Description { get; set; }
        [Range(1, 100, ErrorMessage = "Invalid Intensity value, Range: 1 - 100")]
        public int Intensity { get; set; }
    }
}
