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
    public class IncubatorActivityApplyController : BaseController, IIncubatorActivityApply
    {
        private readonly IncubatorActivityApplyManager _incubatorActivityApplyManager = new IncubatorActivityApplyManager();

        [Authorize]
        [HttpPost]
        [Route("incubatoractivityapply")]
        public IHttpActionResult CreateIncubatorActivityApply(IncubatorActivityApplyCreateRequest incubatorActivityApplyDto)
        {

            return Ok(_incubatorActivityApplyManager.CreateIncubatorActivityApply(incubatorActivityApplyDto));
        }

        [Authorize]
        [HttpGet]
        [Route("incubatoractivityapply/{id:Guid}")]
        public IHttpActionResult GetIncubatorActivityApply(Guid id)
        {
            return Ok(_incubatorActivityApplyManager.GetIncubatorActivityApplyByGuid(id));
        }

        [HttpPost]
        [Route("incubatoractivityapplies")]
        public IHttpActionResult GetIncubatorActivityApplys(IncubatorActivityApplyRequest conditions)
        {
            return Ok(_incubatorActivityApplyManager.GetAll(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("myincubatoractivityapplies")]
        public IHttpActionResult GetMyIncubatorActivityApplys(IncubatorActivityApplyRequest conditions)
        {
            return Ok(_incubatorActivityApplyManager.GetMyAll(conditions));
        }

        [Authorize]
        [HttpPut]
        [Route("incubatoractivityapply")]
        public IHttpActionResult UpdateIncubatorActivityApply(IncubatorActivityApplyUpdateRequest incubatorActivityApplyDto)
        {
            if (ModelState.IsValid)
            {
                _incubatorActivityApplyManager.UpdateIncubatorActivityApply(incubatorActivityApplyDto);
                return Ok();
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("incubatoractivityapply/{id:Guid}")]
        public IHttpActionResult DeleteIncubatorActivityApply(Guid id)
        {
            _incubatorActivityApplyManager.DeleteIncubatorActivityApply(id);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("incubatoractivityapply/revoke")]
        public IHttpActionResult RevokeActivityPublishApply(IncubatorActivityApplyCreateRequest incubatorActivityApplyDto)
        {
            return Ok(_incubatorActivityApplyManager.RevokeIncubatorActivityApply(incubatorActivityApplyDto));
        }

    }
}
