using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TopicUpdateDto
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
