using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class ActivityCalendarController : BaseController, IActivityCalendar
    {
        private readonly ActivityCalendarManager _activityCalendarManager = new ActivityCalendarManager();

        [HttpPost]
        [Route("activitycalendar/datetime")]
        public IHttpActionResult GetActivityCalendarDateTime(ActivityCalendarRequest activityCalendarRequest)
        {

            if (ModelState.IsValid)
            {
                return Ok(_activityCalendarManager.GetMarkedDate(activityCalendarRequest));
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost]
        [Route("activitycalendar/information")]
        public IHttpActionResult GetActivityCalendarInformation(ActivityCalendarInformationRequest activityCalendarInformationRequest)
        {
            if (ModelState.IsValid)
            {
                return Ok(_activityCalendarManager.GetActivityInformation(activityCalendarInformationRequest));
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [HttpPost]
        [Route("activitycalendar/detail")]
        public IHttpActionResult GetActivityDetail(ActivityDetailRequest activityDetailRequest)
        {
            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null && !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
            {
                return Ok(_activityCalendarManager.GetActivityDetail(activityDetailRequest));
            }
            else
            {
                return Ok(_activityCalendarManager.GetActivityDetailByAnonymous(activityDetailRequest));
            }
        }

        [Authorize]
        [HttpPost]
        [Route("activitycalendar/all")]
        public IHttpActionResult GetActivityAll(ActivityManageRequest conditions)
        {
            if (ModelState.IsValid)
            {
                return Ok(_activityCalendarManager.GetActivityAll(conditions));
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
    }
}
