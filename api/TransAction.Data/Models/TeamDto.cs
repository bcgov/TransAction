﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class TeamDto
    {
        [JsonProperty("id")]
        public int TeamId { get; set; }
        public string Name { get; set; }
        public int RegionId { get; set; }
        public string Description { get; set; }
        public int Goal { get; set; }
        [JsonProperty("teamLeaderId")]
        public int UserId { get; set; }
        public string TeamLeaderName { get; set; }
        public int[] TeamMemberIds { get; set; }
        public int NumMembers { get; set; }
        public long ConcurrencyControlNumber { get; set; }
        [JsonProperty("images")]
        public HashSet<ImageDto> TraImage { get; set; }
    }
}
