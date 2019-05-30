using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public class UserDto
    {
        [JsonProperty("id")]
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Directory { get; set; }
        public string Guid { get; set; }
        public int RegionId { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
        public int? TeamId { get; set; }
        public Boolean IsFreeAgent { get; set; }
        public long ConcurrencyControlNumber { get; set; }
        [JsonProperty("images")]
        public HashSet<ImageDto> TraImage { get; set; }
    }
}
