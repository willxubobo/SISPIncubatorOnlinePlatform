using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IActivityPublishApply
    {
        IHttpActionResult CreateActivityPublishApply(ActivityPublishApplyCreateRequest activityPublishApplyDto);
        IHttpActionResult GetActivityPublishApply(Guid id);
        IHttpActionResult GetActivityPublishApplys(ActivityPublishApplyRequest conditions);
        IHttpActionResult UpdateActivityPublishApply(ActivityPublishApplyUpdateRequest activityPublishApplyDto);
        IHttpActionResult DeleteActivityPublishApply(Guid id);
    }
}