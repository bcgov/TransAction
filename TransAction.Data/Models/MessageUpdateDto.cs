using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TransAction.Data.Models
{
    public class MessageUpdateDto
    {
        [Required(ErrorMessage = "Message Body Required")]
        public string Body { get; set; }
        [Required(ErrorMessage = "Topic Id Required")]
        public int TopicId { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
