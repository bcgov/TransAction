using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class RegionUpdateDto
    {
        [Required(ErrorMessage = "Region Name Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Region Description Required")]
        public string Description { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
