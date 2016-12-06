using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivityCalendarResponse
    {
        public List<DateTime> DateList { get; set; }
    }

    public class ActivityCalendarInformationResponse
    {
        public IList<ActivityCalendarResponseDTO> ActivityCalendarResponseList { get; set; }
    }
}