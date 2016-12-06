using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivityCalendarRequest
    {
        public ActivityCalendarDTO ActivityCalendarDto { get; set; }
    }
    public class ActivityCalendarInformationRequest
    {
        public ActivityCalendarInformationDTO ActivityCalendarDto { get; set; }
    }

    public class ActivityManageRequest: SearchRequest
    {
        public string Status { get; set; }
    }
}