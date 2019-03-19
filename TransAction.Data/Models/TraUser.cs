using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{    public partial class TraUser
    {
        public TraUser()
        {
            TraEventUser = new HashSet<TraEventUser>();
            TraMemberReq = new HashSet<TraMemberReq>();
            TraTeam = new HashSet<TraTeam>();
            TraTopic = new HashSet<TraTopic>();
            TraTopicMessage = new HashSet<TraTopicMessage>();
            TraUserActivity = new HashSet<TraUserActivity>();
        }

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
        public DateTime? EffectiveStartDate { get; set; }
        public DateTime? EffectiveEndDate { get; set; }
        public string CreatedByUser { get; set; }
        public DateTime? CreatedByDate { get; set; }
        public string LastUpdatedByUser { get; set; }
        public DateTime? LastUpdatedByDate { get; set; }

        public TraRole Role { get; set; }
        public TraTeam Team { get; set; }
        public ICollection<TraEventUser> TraEventUser { get; set; }
        public ICollection<TraMemberReq> TraMemberReq { get; set; }
        public ICollection<TraTeam> TraTeam { get; set; }
        public ICollection<TraTopic> TraTopic { get; set; }
        public ICollection<TraTopicMessage> TraTopicMessage { get; set; }
        public ICollection<TraUserActivity> TraUserActivity { get; set; }
    }
}
