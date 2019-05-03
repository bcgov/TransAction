using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class CurrentTeamRequestsDto
    {
        [JsonProperty("id")]
        public int MemberReqId { get; set; }
        public int UserId { get; set; }
        public int TeamId { get; set; }
        public Boolean IsActive { get; set; }
    }
}
