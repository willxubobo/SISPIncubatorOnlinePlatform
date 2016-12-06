using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    interface IActivityCalendar
    {
        IHttpActionResult GetActivityCalendarDateTime(ActivityCalendarRequest activityCalendarRequest);
        IHttpActionResult GetActivityCalendarInformation(ActivityCalendarInformationRequest activityCalendarRequest);
    }
}
