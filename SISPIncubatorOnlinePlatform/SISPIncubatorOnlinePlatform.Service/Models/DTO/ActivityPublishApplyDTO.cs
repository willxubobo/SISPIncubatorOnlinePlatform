using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivityPublishApplyDTO
    {
        public System.Guid ActivityID { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Topic { get; set; }
        public string Sponsor { get; set; }
        public string Co_sponsor { get; set; }
        public string Industry { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public string TimeBucket { get; set; }
        public string Remark { get; set; }
        public string ActivityDescription { get; set; }
        public string Status { get; set; }
        public string Origin { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
    }
}