﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class MemberReqCreateDto
    {
        public int UserId { get; set; }
        public int TeamId { get; set; }
       // public long ConcurrencyControlNumber { get; set; }
    }
}
