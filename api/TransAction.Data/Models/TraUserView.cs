﻿using System;
using System.Collections.Generic;
using System.Text;

namespace TransAction.Data.Models
{
    public partial class TraUserView
    {
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
        public bool? IsFreeAgent { get; set; }
        public long ConcurrencyControlNumber { get; set; }
        public string ProfileImageGuid { get; set; }
    }
}
