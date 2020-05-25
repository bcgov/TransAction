using System;
using System.Collections.Generic;

namespace TransAction.Data.Models
{
    public partial class TraImage
    {
        public int ImageId { get; set; }
        public int? UserId { get; set; }
        public int? TeamId { get; set; }
        public bool Carousel { get; set; }
        public string Filename { get; set; }
        public long Filesize { get; set; }
        public string ContentType { get; set; }
        public byte[] Data { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Guid { get; set; }
        public DateTime DbCreateTimestamp { get; set; }
        public string DbCreateUserid { get; set; }
        public DateTime DbLastUpdateTimestamp { get; set; }
        public string DbLastUpdateUserid { get; set; }
        public long ConcurrencyControlNumber { get; set; }

        public virtual TraTeam Team { get; set; }
        public virtual TraUser User { get; set; }
    }
}
