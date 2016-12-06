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
using System.Web.Http.Description;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class SuccessfulCaseController : BaseController, ISuccessfulCase
    {
        private readonly SuccessfulCaseManager _successfulCaseManager = new SuccessfulCaseManager();

        [Authorize]
        [HttpPost]
        [Route("successfulcase")]
        public IHttpActionResult CreateSuccessfulCase(SuccessfulCaseCreateRequest successfulCaseCreateRequest)
        {
            _successfulCaseManager.CreateSuccessfulCase(successfulCaseCreateRequest);
            return Ok();
        }

        [HttpGet]
        [Route("successfulcase/{id:Guid}")]
        public IHttpActionResult GetSuccessfulCase(Guid id)
        {
            SuccessfulCaseResponse successfulCaseResponse = new SuccessfulCaseResponse();
            List<SuccessfulCaseDTO> list = _successfulCaseManager.GetSuccessfulCaseById(id);
            successfulCaseResponse.Results = list;
            return Ok(successfulCaseResponse);
        }

        [HttpPost]
        [Route("successfulcases")]
        public IHttpActionResult GetSuccessfulCases(SuccessfulCaseRequest conditions)
        {
            SuccessfulCaseResponse successfulCaseResponse = new SuccessfulCaseResponse();
            successfulCaseResponse = _successfulCaseManager.GetAll(conditions);
            return Ok(successfulCaseResponse);
        }

        [Authorize]
        [HttpPut]
        [Route("successfulcase")]
        public IHttpActionResult UpdateSuccessfulCase(SuccessfulCaseCreateRequest successfulCaseCreateRequest)
        {
            _successfulCaseManager.UpdateSuccessfulCase(successfulCaseCreateRequest);
            return Ok();
        }

        [HttpDelete]
        [Route("successfulcase/{id:Guid}")]
        public IHttpActionResult DeleteSuccessfulCase(Guid id)
        {
             _successfulCaseManager.DeleteSuccessfulCase(id);
            return Ok();
        }
    }
}