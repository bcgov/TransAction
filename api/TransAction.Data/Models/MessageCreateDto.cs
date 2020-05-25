using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class MessageCreateDto
    {
        [Required(ErrorMessage = "User Id Required")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Message body Required")]
        public string Body { get; set; }
        [Required(ErrorMessage = "Topic Id Required")]
        public int TopicId { get; set; }

    }
}
