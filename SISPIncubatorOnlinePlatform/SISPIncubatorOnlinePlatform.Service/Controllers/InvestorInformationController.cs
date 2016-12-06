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
    public class InvestorInformationController : BaseController, IInvestorInformation
    {
        private readonly InvestorInformationManager _investorInformationManager = new InvestorInformationManager();

        [Authorize]
        [HttpPost]
        [Route("investorinformation")]
        public IHttpActionResult CreateInvestorInformation(InvestorInformationCreateRequest investorInformationCreateRequest)
        {
            _investorInformationManager.CreateInvestorInformation(investorInformationCreateRequest);
            return Ok();
        }

        [HttpGet]
        [ResponseType(typeof(InvestorInformationResponse))]
        [Route("investorinformation/{id:Guid}")]
        public IHttpActionResult GetInvestorInformation(Guid id)
        {
            InvestorInformationResponse investorInformationResponse = new InvestorInformationResponse();
            List<InvestorInformationDTO> list = _investorInformationManager.GetInvestorInformationById(id);
            investorInformationResponse.Results = list;
            return Ok(investorInformationResponse);
        }

        [HttpPost]
        [Route("investorinformations")]
        public IHttpActionResult GetInvestorInformations(InvestorInformationRequest conditions)
        {
            int TotalRecords, TotalPage;
            InvestorInformationResponse investorInformationResponse = new InvestorInformationResponse();
            List<InvestorInformationDTO> list = _investorInformationManager.GetAll(conditions,out TotalRecords,out TotalPage);
            investorInformationResponse.Results = list;
            investorInformationResponse.TotalCount = TotalRecords;
            investorInformationResponse.TotalPage = TotalPage;
            return Ok(investorInformationResponse);
        }

        [HttpPost]
        [Route("investorinformations/pc")]
        public IHttpActionResult GetInvestorInformations_PC(InvestorInformationRequest conditions)
        {
            InvestorInformationResponse investorInformationResponse = new InvestorInformationResponse();
            List<InvestorInformationDTO> list = _investorInformationManager.GetAll_PC(conditions);
            investorInformationResponse.Results = list;
            investorInformationResponse.TotalCount = list.Count;
            return Ok(investorInformationResponse);
        }

        [Authorize]
        [HttpPut]
        [Route("investorinformation")]
        public IHttpActionResult UpdateInvestorInformation(InvestorInformationCreateRequest investorInformationCreateRequest)
        {
            _investorInformationManager.UpdateInvestorInformation(investorInformationCreateRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpDelete]
        [Route("investorinformation/{id:Guid}")]
        public IHttpActionResult DeleteInvestorInformation(Guid id)
        {
             _investorInformationManager.DeleteInvestorInformation(id);
            return Ok();
        }
    }
}
