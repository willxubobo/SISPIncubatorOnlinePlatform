using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivityDetailResponseDTO
    {
        public System.Guid ActivityID { get; set; }
        public string Topic { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public string Sponsor { get; set; }
        public string Co_sponsor { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string ActivityDescription { get; set; }
    }
}