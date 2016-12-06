using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class SearchController : BaseController
    {
        [HttpPost]
        [Route("search/investors")]
        public IHttpActionResult GetInvestorsResults(GlobalSearchRequest globalSearchRequest)
        {
            InvestorInformationResponse investorInformationResponse=new InvestorInformationResponse();

            GlobalSearchManager globalSearchManager = new GlobalSearchManager();
            int total = 0;
            List < InvestorInformationDTO > dtoList = globalSearchManager.GetInvestors(globalSearchRequest, out total);

            investorInformationResponse.Results = dtoList;
            investorInformationResponse.TotalCount = total;

            return Ok(investorInformationResponse);
        }
        [HttpPost]
        [Route("search/financingrequirements")]
        public IHttpActionResult GetFinancingRequirementsResults(GlobalSearchRequest globalSearchRequest)
        {

            FinancingRequirementsResponse financingRequirementsResponse = new FinancingRequirementsResponse();
            GlobalSearchManager globalSearchManager = new GlobalSearchManager();
            int total = 0;
            List<FinancingRequirementsDTO> dtoList = globalSearchManager.GetFinancingRequirements(globalSearchRequest, out total);

            financingRequirementsResponse.Results = dtoList;
            financingRequirementsResponse.TotalCount = total;

            return Ok(financingRequirementsResponse);
        }
        [HttpPost]
        [Route("search/servicepublishs")]
        public IHttpActionResult GetServicePublishsResults(GlobalSearchRequest globalSearchRequest)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            GlobalSearchManager globalSearchManager = new GlobalSearchManager();
            int total = 0;
            List<ServicePublishDTO> dtoList = globalSearchManager.GetServicePublishs(globalSearchRequest, out total);

            servicePublishResponse.Results = dtoList;
            servicePublishResponse.TotalCount = total;

            return Ok(servicePublishResponse);
        }
        [HttpPost]
        [Route("search/demandpublishs")]
        public IHttpActionResult GetDemandPublishResults(GlobalSearchRequest globalSearchRequest)
        {
            DemandPublishResponse servicePublishResponse = new DemandPublishResponse();
            GlobalSearchManager globalSearchManager = new GlobalSearchManager();
            int total = 0;
            List<DemandPublishDTO> dtoList = globalSearchManager.GetDemandPublishs(globalSearchRequest, out total);

            servicePublishResponse.Results = dtoList;
            servicePublishResponse.TotalCount = total;

            return Ok(servicePublishResponse);
        }
    }
}
