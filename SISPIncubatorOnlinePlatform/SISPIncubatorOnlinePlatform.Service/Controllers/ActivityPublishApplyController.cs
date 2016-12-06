using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class ActivityPublishApplyController : BaseController, IActivityPublishApply
    {
        private readonly ActivityPublishApplyManager _activityPublishApplyManager = new ActivityPublishApplyManager();

        [Authorize]
        [HttpPost]
        [Route("activitypublishapply")]
        public IHttpActionResult CreateActivityPublishApply(ActivityPublishApplyCreateRequest activityPublishApplyDto)
        {
            return Ok(_activityPublishApplyManager.CreateActivityPublishApply(activityPublishApplyDto));
        }

        [Authorize]
        [HttpPost]
        [Route("activitypublishapply/revoke")]
        public IHttpActionResult RevokeActivityPublishApply(ActivityPublishApplyCreateRequest activityPublishApplyDto)
        {
            return Ok(_activityPublishApplyManager.RevokeActivityPublishApply(activityPublishApplyDto));
        }

        [Authorize]
        [HttpGet]
        [Route("activitypublishapply/{id:Guid}")]
        public IHttpActionResult GetActivityPublishApply(Guid id)
        {
            return Ok(_activityPublishApplyManager.GetActivityPublishApplyByGuid(id));
        }

        [HttpPost]
        [Route("activitypublishapplies")]
        public IHttpActionResult GetActivityPublishApplys(ActivityPublishApplyRequest conditions)
        {
            return Ok(_activityPublishApplyManager.GetAll(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("myactivitypublishapplies")]
        public IHttpActionResult GetMyActivityPublishApplys(ActivityPublishApplyRequest conditions)
        {
            return Ok(_activityPublishApplyManager.GetMyAll(conditions));
        }

        [Authorize]
        [HttpPut]
        [Route("activitypublishapply")]
        public IHttpActionResult UpdateActivityPublishApply(ActivityPublishApplyUpdateRequest activityPublishApplyDto)
        {
            _activityPublishApplyManager.UpdateActivityPublishApply(activityPublishApplyDto);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("activitypublishapply/{id:Guid}")]
        public IHttpActionResult DeleteActivityPublishApply(Guid id)
        {
            _activityPublishApplyManager.DeleteActivityPublishApply(id);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("activity/approve")]
        public IHttpActionResult UpdateActivityStatusAndApprove(ActivityPublishApplyApproveRequest activityPublishApplyApproveRequest)
        {
            _activityPublishApplyManager.UpdateActivityStatusAndApprove(activityPublishApplyApproveRequest);
            return Ok();
        }
        [Authorize]
        [HttpPost]
        [Route("activity/remove")]
        public IHttpActionResult RemoveActivityApply(ActivityPublishApplyApproveRequest activityPublishApplyApproveRequest)
        {
            _activityPublishApplyManager.RemoveActivityRecord(activityPublishApplyApproveRequest);
            return Ok();
        }
    }
}
