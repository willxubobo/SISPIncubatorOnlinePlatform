using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivityCalendarResponseDTO
    {
        public System.Guid ActivityID { get; set; }
        public string Topic { get; set; }
        public int Category { get; set; }
    }
}