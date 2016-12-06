using SISPIncubatorOnlinePlatform.Service.Common;
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
    public class FinancingRequirementFollowController : BaseController, IFinancingRequirementFollow
    {
        private readonly FinancingRequirementFollowManager _financingRequirementFollowManager = new FinancingRequirementFollowManager();

        [Authorize]
        [HttpPost]
        [Route("financingrequirementfollows")]
        public IHttpActionResult GetFinancingRequirementFollows(FinancingRequirementFollowRequest conditions)
        {
            FinancingRequirementFollowResponse financingRequirementFollowResponse = new FinancingRequirementFollowResponse();
            List<FinancingRequirementFollowDTO> list = _financingRequirementFollowManager.GetAll(conditions);
            financingRequirementFollowResponse.Results = list;
            return Ok(financingRequirementFollowResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("financingrequirementfollow")]
        public IHttpActionResult CreateFinancingRequirementFollow(Models.FinancingRequirementFollowCreateRequest financingRequirementFollowCreateRequest)
        {
             Guid followID=_financingRequirementFollowManager.CreateFinancingRequirementFollow(financingRequirementFollowCreateRequest);
             return Ok(followID.ToString());
        }

        [Authorize]
        [HttpPut]
        [Route("financingrequirementfollow")]
        public IHttpActionResult UpdateFinancingRequirementFollow(Models.FinancingRequirementFollowCreateRequest financingRequirementFollowCreateRequest)
        {
            _financingRequirementFollowManager.UpdateFinancingRequirementFollow(financingRequirementFollowCreateRequest);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("financingrequirementfollow/{followId:Guid}")]
        public IHttpActionResult DeleteFinancingRequirementFollow(Guid followId)
        {
             _financingRequirementFollowManager.DeleteFinancingRequirementFollow(followId);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("myfinancingrequirementfollows")]
        public IHttpActionResult GetMyFinancingRequirementFollows(FinancingRequirementFollowRequest conditions)
        {
            MyFinancingRequirementFollowResponse financingRequirementFollowResponse = new MyFinancingRequirementFollowResponse();
            financingRequirementFollowResponse = _financingRequirementFollowManager.GetMyFinancingRequirementAll(conditions);
            return Ok(financingRequirementFollowResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("myinvestorfollows")]
        public IHttpActionResult GetMyInvestorFollows(FinancingRequirementFollowRequest conditions)
        {
            MyInvestorFollowResponse investorFollowResponse = new MyInvestorFollowResponse();
            investorFollowResponse = _financingRequirementFollowManager.GetMyInvestorAll(conditions);
            return Ok(investorFollowResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("myfansfollows")]
        public IHttpActionResult GetMyFans(FinancingRequirementFollowRequest conditions)
        {
            MyFansResponse fansResponse = new MyFansResponse();
            fansResponse = _financingRequirementFollowManager.GetMyFans(conditions);
            return Ok(fansResponse);
        }
    }
}
