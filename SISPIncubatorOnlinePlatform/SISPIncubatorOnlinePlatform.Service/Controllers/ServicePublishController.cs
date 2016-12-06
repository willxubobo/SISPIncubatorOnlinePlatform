using SISPIncubatorOnlinePlatform.Service.Common;
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

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
     [RoutePrefix("api")]
    public class ServicePublishController : BaseController, IServicePublish
    {
        private readonly ServicePublishManager _servicePublishManager = new ServicePublishManager();

        [Authorize]
        [HttpPost]
        [Route("servicepublish")]
        public IHttpActionResult CreateServicePublish(ServicePublishCreateRequest servicePublishDto)
        {
            return Ok(_servicePublishManager.CreateServicePublish(servicePublishDto));
        }

        [Authorize]
        [HttpPost]
        [Route("servicepublish/revoke")]
        public IHttpActionResult RevokeServicePublish(ServicePublishCreateRequest servicePublishDto)
        {
            return Ok(_servicePublishManager.RevokeServicePublish(servicePublishDto));
        }

        [HttpGet]
        [Route("servicepublish/{id:Guid}")]
        public IHttpActionResult GetServicePublish(Guid id)
        {
            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null && !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
            {
                return Ok(_servicePublishManager.GetServicePublishByGuid(id));
            }
            else
            {
                return Ok(_servicePublishManager.GetServicePublishByAnonymous(id));
            }
        }

        //[Authorize]
        [HttpPost]
        [Route("servicepublishes")]
        public IHttpActionResult GetServicePublishs(ServicePublishRequest conditions)
        {
            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null && !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
            {
                return Ok(_servicePublishManager.GetAll(conditions));
            }
            else
            {
                return Ok(_servicePublishManager.GetAllByAnonymous(conditions));
            }
        }

        [Authorize]
        [HttpPut]
        [Route("servicepublish")]
        public IHttpActionResult UpdateServicePublish(ServicePublishUpdateRequest servicePublishDto)
        {
            _servicePublishManager.UpdateServicePublish(servicePublishDto);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("servicepublish/{id:Guid}")]
        public IHttpActionResult DeleteServicePublish(Guid id)
        {
            _servicePublishManager.DeleteServicePublish(id);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("myservicepublishs")]
        public IHttpActionResult GetMyServicePublishs(ServicePublishRequest conditions)
        {
            return Ok(_servicePublishManager.GetMyAllServices(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("servicepublish/all")]
        public IHttpActionResult GetAllServicePublishs(ServicePublishRequest conditions)
        {
            return Ok(_servicePublishManager.GetAllServicePublish(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("servicepublish/approve")]
        public IHttpActionResult UpdateServiceStatusAndApprove(ServicePublishApproveRequest servicePublishApproveRequest)
        {
            _servicePublishManager.UpdateServiceStatusAndApprove(servicePublishApproveRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("servicepublish/remove")]
        public IHttpActionResult RemoveServicepublishs(ServicePublishApproveRequest servicePublishApproveRequest)
        {
            _servicePublishManager.RemoveServiceRecord(servicePublishApproveRequest);
            return Ok();
        }
    }
}
