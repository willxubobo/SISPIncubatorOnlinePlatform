using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivityManageResponseDTO
    {
        public System.Guid ActivityID { get; set; }
        public string CompanyName { get; set; }
        public string Topic { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public System.DateTime Created { get; set; }
        public int Category { get; set; }
        public string Status { get; set; }
    }
}