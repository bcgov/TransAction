﻿using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class MessageUpdateDto
    {
        public int UserId { get; set; }
        public string Body { get; set; }
        public int TopicId { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
