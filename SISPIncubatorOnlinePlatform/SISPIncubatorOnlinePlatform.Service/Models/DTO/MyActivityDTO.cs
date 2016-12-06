using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class MyActivityDto
    {
        public Guid SignUpID { get; set; }
        public System.Guid ActivityId { get; set; }
        public string Topic { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public int Category { get; set; }
    }
}