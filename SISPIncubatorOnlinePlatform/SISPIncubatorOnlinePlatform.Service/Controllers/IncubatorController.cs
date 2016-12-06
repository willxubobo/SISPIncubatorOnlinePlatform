using SISPIncubatorOnlinePlatform.Service.Interfaces;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Xml.Schema;
using OfficeOpenXml;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class IncubatorController : BaseController, IIncubator
    {
        [HttpGet]
        [Route("incubator/{id:Guid}")]
        public IHttpActionResult GetIncubator(Guid id)
        {
            IncubatorResponse incubatorResponse = new IncubatorResponse();
            IncubatorManager incubatorManager = new IncubatorManager();
            List<IncubatorDTO> list = incubatorManager.Get(id);

            incubatorResponse.Results = list;
            incubatorResponse.TotalCount = list.Count;

            return Ok(incubatorResponse);
        }

        [HttpPost]
        [Route("incubators")]
        public IHttpActionResult GetIncubators(IncubatorRequest conditions)
        {
            IncubatorResponse incubatorResponse = new IncubatorResponse();
            IncubatorManager incubatorManager = new IncubatorManager();
            int total = 0;
            List<IncubatorDTO> list = incubatorManager.GetAllByCondition(conditions, out total);

            //List<IncubatorDTO> dtoList = new List<IncubatorDTO>();
            //Utility.CopyList<IncubatorInformation, IncubatorDTO>(list, dtoList);
            incubatorResponse.Results = list;
            incubatorResponse.TotalCount = total;
            return Ok(incubatorResponse);
        }
        [Authorize]
        [HttpPost]
        [Route("incubators/pcprojectreport")]
        public IHttpActionResult GetIncubatorsProjectReport(IncubatorRequest conditions)
        {
            IncubatorProjectReportResponse incubatorResponse = new IncubatorProjectReportResponse();
            IncubatorManager incubatorManager = new IncubatorManager();
            int total = 0;
            List<IncubatorProjectReportDTO> list = incubatorManager.GetIncubatorProjectReportByCondition(conditions, out total);
            incubatorResponse.Results = list;
            incubatorResponse.TotalCount = total;
            return Ok(incubatorResponse);
        }
        [HttpPost]
        [Route("incubators/pcweb")]
        public IHttpActionResult GetPcIncubators(IncubatorRequest conditions)
        {
            IncubatorResponse incubatorResponse = new IncubatorResponse();
            IncubatorManager incubatorManager = new IncubatorManager();
            int total = 0;
            List<IncubatorDTO> list = incubatorManager.GetPcAllByCondition(conditions, out total);
            incubatorResponse.Results = list;
            incubatorResponse.TotalCount = total;
            return Ok(incubatorResponse);
        }
        [Authorize]
        [SSIPActionFilter]
        [HttpPost]
        [Route("incubators/pcdm")]
        public IHttpActionResult DeletePcIncubators(IncubatorInfoDeleteRequest conditions)
        {
            IncubatorManager incubatorManager = new IncubatorManager();
            incubatorManager.DeleteIncubators(conditions);
            return Ok();
        }
        [Authorize]
        [HttpPost]
        [Route("incubator")]
        public IHttpActionResult CreateIncubator(IncubatorInfoRequest incubatorDto)
        {
            IncubatorManager incubatorManager = new IncubatorManager();
            incubatorManager.Add(incubatorDto);

            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("incubator")]
        public IHttpActionResult UpdateIncubator(IncubatorInfoRequest incubatorDto)
        {
            IncubatorManager incubatorManager = new IncubatorManager();

            incubatorManager.Update(incubatorDto);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("incubator/pcweb")]
        public IHttpActionResult ModifyIncubatorOfPc(IncubatorInfoRequest incubatorDto)
        {
            IncubatorManager incubatorManager = new IncubatorManager();
            incubatorManager.UpdateOfPc(incubatorDto);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("incubator/{id:Guid}")]
        public IHttpActionResult DeleteIncubator(Guid id)
        {
            IncubatorManager incubatorManager = new IncubatorManager();
            incubatorManager.Delete(id);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("incubators/exportprojectreport")]
        public IHttpActionResult ExportProjectReportToExcel(IncubatorRequest conditions)
        {
            IncubatorManager incubatorManager = new IncubatorManager();
            ExportResponse exportResponse=new ExportResponse();
            int tt = 0;
            exportResponse.FileUrl=incubatorManager.ExportProjectToExcel(conditions, out  tt);
            return Ok(exportResponse);
        }
    }

}