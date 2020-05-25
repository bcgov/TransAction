﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class MemberReqDto
    {
        [JsonProperty("id")]
        public int MemberReqId { get; set; }
        public int TeamId { get; set; }
        public int UserId { get; set; }
        public bool? IsActive { get; set; }
        public long ConcurrencyControlNumber { get; set; }
    }
}
