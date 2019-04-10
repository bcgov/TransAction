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
        public string Region { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
        public int? TeamId { get; set; }
        public long ConcurencyControlNumber { get; set; }
    }
}
