using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class ActivitySignUpController : BaseController, IActivitySignUp
    {
        private readonly ActivitySignUpManager _activitySignUpManager = new ActivitySignUpManager();

        [Authorize]
        [HttpPost]
        [Route("activitysignup")]
        public IHttpActionResult CreateActivitySignUp(ActivitySignUpCreateRequest activitySignUpDto)
        {
            return Ok(_activitySignUpManager.CreateActivitySignUp(activitySignUpDto));
        }

        [Authorize]
        [HttpGet]
        [Route("activitysignup/{id:Guid}")]
        public IHttpActionResult GetActivitySignUp(Guid id)
        {
            return Ok(_activitySignUpManager.GetActivitySignUpByGuid(id));
        }

        [Authorize]
        [HttpPost]
        [Route("activitysignups")]
        public IHttpActionResult GetActivitySignUps(ActivitySignUpRequest conditions)
        {
            return Ok(_activitySignUpManager.GetAll(conditions));
        }

        [Authorize]
        [HttpPut]
        [Route("activitysignup")]
        public IHttpActionResult UpdateActivitySignUp(ActivitySignUpUpdateRequest activitySignUpDto)
        {
            _activitySignUpManager.UpdateActivitySignUp(activitySignUpDto);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("activitysignup/{id:Guid}")]
        public IHttpActionResult DeleteActivitySignUp(Guid id)
        {
            _activitySignUpManager.DeleteActivitySignUp(id);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("myactivity")]
        public IHttpActionResult GetMyActivity(MyActivityRequest conditions)
        {
            return Ok(_activitySignUpManager.GetMyActivity(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("activitysignups/stats")]
        public IHttpActionResult GetActivitySignupStats(ActivitySignUpRequest conditions)
        {
            return Ok(_activitySignUpManager.GetSignupStats(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("activitysignups/information")]
        public IHttpActionResult GetActivitySignupInformation(ActivitySignUpRequest conditions)
        {
            return Ok(_activitySignUpManager.GetSignupInformation(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("activitysignups/exportreport")]
        public IHttpActionResult ExportProjectReportToExcel(ActivitySignUpRequest conditions)
        {
            return Ok(_activitySignUpManager.ExportToExcel(conditions));
        }
    }
}
