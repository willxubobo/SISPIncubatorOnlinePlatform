using SISPIncubatorOnlinePlatform.Service.Interfaces;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class OfficeApplyController : BaseController, IOfficeApply
    {
        [HttpPost]
        [Route("officeapplies")]
        public IHttpActionResult GetOfficeApplies(OfficeApplyRequest conditions)
        {
            OfficeApplyResponse officeApplyResponse = new OfficeApplyResponse();

            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();

            int totalCount = 0;

            List<OfficeApplyDTO> dtoList = incubatorApplyManager.GetAllByCondition(conditions, out totalCount);

            officeApplyResponse.Results = dtoList;

            officeApplyResponse.TotalCount = totalCount;

            return Ok(officeApplyResponse);
        }

        [HttpGet]
        [Route("officeapply/{id:Guid}")]
        public IHttpActionResult GetOfficeApplyById(Guid id)
        {
            OfficeApplyResponse officeApplyResponse = new OfficeApplyResponse();

            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            List<OfficeApplyDTO> list = incubatorApplyManager.GetOfficeApplyByid(id);

            officeApplyResponse.Results = list;

            officeApplyResponse.TotalCount = list.Count;

            return Ok(officeApplyResponse);
        }

        [HttpPost]
        [Route("officeapply")]
        public IHttpActionResult CreateOfficeApply(OfficeApplyCreateRequest officeApplyDto)
        {
            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            incubatorApplyManager.Add(officeApplyDto);
            return Ok();
        }

        [HttpPost]
        [SSIPActionFilter]
        [Route("officeapply/revoke")]
        public IHttpActionResult RevokeOfficeApply(OfficeApplyCreateRequest officeApplyDto)
        {
            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            incubatorApplyManager.RevokeOfficeApply(officeApplyDto);
            return Ok();
        }


        [HttpPost]
        [SSIPActionFilter]
        [Route("officeapply/dm")]
        public IHttpActionResult DeleteOfficeApplies(OfficeApplyDeleteRequest officeApplyDeleteRequest)
        {
            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            incubatorApplyManager.DeleteOfficeApply(officeApplyDeleteRequest);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("officeapply")]
        public IHttpActionResult UpdateOfficeApply(OfficeApplyCreateRequest officeApplyDto)
        {
            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            incubatorApplyManager.Update(officeApplyDto);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        [SSIPActionFilter]
        [Route("officeapply/approve")]
        public IHttpActionResult ApproveOfficeApply(OfficeApplyCreateRequest officeApplyDto)
        {
            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            incubatorApplyManager.ApproveOfficeAplly(officeApplyDto);
            return Ok();
        }

        [Authorize]
        [SSIPActionFilter]
        [HttpDelete]
        [Route("officeapply/{id:Guid}")]
        public IHttpActionResult DeleteOfficeApply(Guid id)
        {
            OfficeApplyManager incubatorApplyManager = new OfficeApplyManager();
            incubatorApplyManager.Delete(id);

            return Ok();
        }

    }
}