using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraUser
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
        public int RegionId { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
        public int? TeamId { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual TraRegion Region { get; set; }
        public virtual TraRole Role { get; set; }
        public virtual TraTeam Team { get; set; }
        public virtual ICollection<TraEventUser> TraEventUser { get; set; }
        public virtual ICollection<TraMemberReq> TraMemberReq { get; set; }
        public virtual ICollection<TraTeam> TraTeam { get; set; }
        public virtual ICollection<TraTopic> TraTopic { get; set; }
        public virtual ICollection<TraTopicMessage> TraTopicMessage { get; set; }
        public virtual ICollection<TraUserActivity> TraUserActivity { get; set; }
    }
}
