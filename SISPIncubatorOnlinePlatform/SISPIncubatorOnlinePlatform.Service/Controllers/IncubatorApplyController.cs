using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class IncubatorApplyController : BaseController, IIncubatorApply
    {
        [HttpPost]
        [Route("incubatorapplies")]
        public IHttpActionResult GetIncubatorApplies(IncubatorApplyRequest conditions)
        {
            IncubatorApplyResponse incubatorApplyResponse = new IncubatorApplyResponse();

            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();

            int total = 0;

            List<IncubatorApplyDTO> dtoList = incubatorApplyManager.GetAll(conditions, out total);

            incubatorApplyResponse.Results = dtoList;

            incubatorApplyResponse.TotalCount = total;

            return Ok(incubatorApplyResponse);
        }

        [HttpGet]
        [Route("incubatorapply/{id:Guid}")]
        public IHttpActionResult GetIncubatorApplyById(Guid id)
        {
            IncubatorApplyResponse incubatorApplyResponse = new IncubatorApplyResponse();
            IncubatorApplyManager tIncubatorApplyManager = new IncubatorApplyManager();
            List < IncubatorApplyDTO > dtoList = tIncubatorApplyManager.GetIncubatorApplyByGuid(id);
            incubatorApplyResponse.Results = dtoList;
            incubatorApplyResponse.TotalCount = dtoList.Count;

            return Ok(incubatorApplyResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("incubatorapply")]
        public IHttpActionResult CreateIncubatorApply(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();

            incubatorApplyManager.Add(incubatorApplyCreateRequest);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("incubatorapply/revoke")]
        public IHttpActionResult RevokeIncubatorApply(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();

            incubatorApplyManager.RevokeIncubatorApply(incubatorApplyCreateRequest);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [SSIPActionFilter]
        [Route("incubatorapply/dm")]
        public IHttpActionResult DeleteIncubatorApplies(IncubatorApplyDeleteRequest incubatorApplyCreateRequest)
        {
            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();

            incubatorApplyManager.DeleteIncubatorApply(incubatorApplyCreateRequest);

            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("incubatorapply")]
        public IHttpActionResult UpdateIncubatorApply(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();
            incubatorApplyManager.Update(incubatorApplyCreateRequest);

            return Ok();
        }
        [Authorize]
        [HttpPut]
        [Route("incubatorapply/approve")]
        public IHttpActionResult UpdateIncubatorApplyStatusAndApprove(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();
            incubatorApplyManager.UpdateApplyStatusAndApprove(incubatorApplyCreateRequest);

            return Ok();
        }
        [Authorize]
        [HttpDelete]
        [Route("incubatorapply/{id:Guid}")]
        public IHttpActionResult DeleteIncubatorApply(Guid id)
        {
            IncubatorApplyManager incubatorApplyManager = new IncubatorApplyManager();
            incubatorApplyManager.Delete(id);

            return Ok();
        }
    }
}