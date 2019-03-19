﻿using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class EventDto
    {
        public int EventId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; }
    }
}
