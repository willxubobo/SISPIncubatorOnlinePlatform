using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivityDetailResponse
    {
        public System.Guid ActivityId { get; set; }
        public string Topic { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public string TimeBucket { get; set; }
        public string Address { get; set; }
        public string Sponsor { get; set; }
        public string Cosponsor { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public IList<string> ImgSrcList { get; set; }
        public string ActivityDescription { get; set; }
        public bool Apply { get; set; }
        public string UserName { get; set; }
        public string Mobile { get; set; }
    }
}