using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class TopicCreateDto
    {
        [Required(ErrorMessage = "Topic Title Required")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Topic Body Required")]
        public string Body { get; set; }
    }
}
