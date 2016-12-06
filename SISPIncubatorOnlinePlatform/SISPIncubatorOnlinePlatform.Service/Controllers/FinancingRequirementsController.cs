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
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class FinancingRequirementsController : BaseController, IFinancingRequirements
    {
        private readonly FinancingRequirementsManager _financingRequirementsManager = new FinancingRequirementsManager();

        [HttpGet]        
        [Route("financingrequirement/{id:Guid}")]
        public IHttpActionResult GetFinancingRequirement(Guid id)
        {
            FinancingRequirementsResponse financingRequirementsResponse = new FinancingRequirementsResponse();
            List<FinancingRequirementsDTO> list = _financingRequirementsManager.GetFinancingRequirementByfrId(id);
            financingRequirementsResponse.Results = list;
            return Ok(financingRequirementsResponse);
        }

        [HttpPost]
        [Route("financingrequirements")]
        public IHttpActionResult GetFinancingRequirements(FinancingRequirementsRequest conditions)
        {
            int TotalRecords, TotalPage;
            FinancingRequirementsResponse financingRequirementsResponse = new FinancingRequirementsResponse();
            List<FinancingRequirementsDTO> list = _financingRequirementsManager.GetAll(conditions, out TotalRecords, out TotalPage);
            financingRequirementsResponse.Results = list;
            financingRequirementsResponse.TotalCount = TotalRecords;
            financingRequirementsResponse.TotalPage = TotalPage;
            return Ok(financingRequirementsResponse);
        }

        [HttpPost]
        [Route("financingrequirements/pc")]
        public IHttpActionResult GetFinancingRequirements_PC(FinancingRequirementsRequest conditions)
        {
            FinancingRequirementsResponse financingRequirementsResponse = new FinancingRequirementsResponse();
            List<FinancingRequirementsDTO> list = _financingRequirementsManager.GetAll_PC(conditions);
            financingRequirementsResponse.Results = list;
            financingRequirementsResponse.TotalCount = list.Count;
            return Ok(financingRequirementsResponse);
        }

        [Authorize]
        [HttpPut]
        [Route("financingrequirement")]
        public IHttpActionResult UpdateFinancingRequirement(FinancingRequirementsCreateRequest financingRequirementsCreateRequest)
        {
            _financingRequirementsManager.UpdateFinancingRequirement(financingRequirementsCreateRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpDelete]
        [Route("financingrequirement/{id:Guid}")]
        public IHttpActionResult DeleteFinancingRequirement(Guid id)
        {
            _financingRequirementsManager.DeleteFinancingRequirement(id);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("financingrequirement")]
        public IHttpActionResult CreateFinancingRequirements(FinancingRequirementsCreateRequest financingRequirementsCreateRequest)
        {
            _financingRequirementsManager.CreateFinancingRequirements(financingRequirementsCreateRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("financingrequirement/revoke")]
        public IHttpActionResult RevokeFinancingRequirement(FinancingRequirementsCreateRequest financingRequirementsCreateRequest)
        {
            _financingRequirementsManager.RevokeFinancingRequirements(financingRequirementsCreateRequest);
            return Ok();
        }
    }
}
