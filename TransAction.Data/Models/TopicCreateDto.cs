using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TopicCreateDto
    {
        public string Title { get; set; }
        public int UserId { get; set; }

        public string Body { get; set; }
    }
}
