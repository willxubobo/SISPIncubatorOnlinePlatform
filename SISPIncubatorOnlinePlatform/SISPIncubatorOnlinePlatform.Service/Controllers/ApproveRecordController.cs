using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class ApproveRecordController : BaseController, IApproveRecord
    {
        private readonly ApproveRecordManager _approveRecordManager = new ApproveRecordManager();

        [Authorize]
        [HttpPost]
        [Route("approverecords")]
        public IHttpActionResult GetApproveRecords(Models.ApproveRecordRequest conditions)
        {
            ApproveRecordResponse approveRecordResponse = new ApproveRecordResponse();
            List<ApproveRecordDTO> approveRecordList = _approveRecordManager.GetAll(conditions);
            approveRecordResponse.Results = approveRecordList;
            approveRecordResponse.TotalCount = approveRecordList.Count;
            return Ok(approveRecordResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("approverecord/myapply")]
        public IHttpActionResult GetMyApply(ApproveRecordRequest conditions)
        {
            ApproveRecordResponse approveRecordResponse = new ApproveRecordResponse();
            List<ApproveRecord> approveRecordList = _approveRecordManager.GetMyApply(conditions);

            List<ApproveRecordDTO> dtoList = new List<ApproveRecordDTO>();
            Utility.CopyList<ApproveRecord, ApproveRecordDTO>(approveRecordList, dtoList);
            approveRecordResponse.Results = dtoList;
            return Ok(approveRecordResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("approverecord/approveinfo")]
        public IHttpActionResult GetApproveInfo(ApproveRecordRequest conditions)
        {
            ApproveRecordResponse approveRecordResponse = new ApproveRecordResponse();
            approveRecordResponse = _approveRecordManager.GetApproveInfo(conditions);
            return Ok(approveRecordResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("approverecord/approve")]
        public IHttpActionResult ApproveOperate(ApproveRecordRequest conditions)
        {
            _approveRecordManager.ApproveOperate(conditions);
            return Ok();
        }
    }
}
