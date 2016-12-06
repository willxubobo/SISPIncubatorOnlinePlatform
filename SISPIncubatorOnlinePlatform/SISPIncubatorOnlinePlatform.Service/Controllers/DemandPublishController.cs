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
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class DemandPublishController : BaseController, IDemandPublish
    {
        private readonly DemandPublishManager _demandPublishManager = new DemandPublishManager();

        [Authorize]
        [HttpPost]
        [Route("demandpublish")]
        public IHttpActionResult CreateDemandPublish(DemandPublishCreateRequest demandPublishDto)
        {
            return Ok(_demandPublishManager.CreateDemandPublish(demandPublishDto));
        }

        [Authorize]
        [HttpPost]
        [Route("demandpublish/revoke")]
        public IHttpActionResult RevokeDemandPublish(DemandPublishCreateRequest demandPublishDto)
        {
            return Ok(_demandPublishManager.RevokeDemandPublish(demandPublishDto));
        }

        [HttpGet]
        [Route("demandpublish/{id:Guid}")]
        public IHttpActionResult GetDemandPublish(Guid id)
        {
            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null && !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
            {
                return Ok(_demandPublishManager.GetDemandPublishByGuid(id));
            }
            else
            {
                return Ok(_demandPublishManager.GetDemandPublishByAnonymou(id));
            }
        }

        [HttpPost]
        [Route("demandpublishs")]
        public IHttpActionResult GetDemandPublishs(DemandPublishRequest conditions)
        {

            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null && !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
            {
                return Ok(_demandPublishManager.GetAll(conditions));
            }
            else
            {
                return Ok(_demandPublishManager.GetAllByAnonymous(conditions));
            }
           
        }

        [Authorize]
        [HttpPut]
        [Route("demandpublish")]
        public IHttpActionResult UpdateDemandPublish(DemandPublishUpdateRequest demandPublishDto)
        {
            _demandPublishManager.UpdateDemandPublish(demandPublishDto);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("demandpublish/{id:Guid}")]
        public IHttpActionResult DeleteDemandPublish(Guid id)
        {
            _demandPublishManager.DeleteDemandPublish(id);
            return Ok();
        }

        [HttpGet]
        [Route("Biddings")]
        public IHttpActionResult GetBiddings()
        {
            return Ok(_demandPublishManager.GetAll());
        }

        [Authorize]
        [HttpPost]
        [Route("mydemandpublishs")]
        public IHttpActionResult GetMyDemandPublishs(DemandPublishRequest conditions)
        {
            return Ok(_demandPublishManager.GetMyAllDemands(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("demandpublishs/all")]
        public IHttpActionResult GetAllDemandPublishs(DemandPublishRequest conditions)
        {
            return Ok(_demandPublishManager.GetAllDemandPublish(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("demandpublishs/approve")]
        public IHttpActionResult UpdateDemandStatusAndApprove(DemandPublishApproveRequest demandPublishApproveRequest)
        {
            _demandPublishManager.UpdateDemandStatusAndApprove(demandPublishApproveRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("demandpublishs/remove")]
        public IHttpActionResult RemoveDemandpublishs(DemandPublishApproveRequest demandPublishApproveRequest)
        {
            _demandPublishManager.RemoveDemandRecord(demandPublishApproveRequest);
            return Ok();
        }
    }
}
