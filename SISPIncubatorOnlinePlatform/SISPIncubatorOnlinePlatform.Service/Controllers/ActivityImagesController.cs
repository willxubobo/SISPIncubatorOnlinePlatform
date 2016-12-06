using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class ActivityImagesController : BaseController, IActivityImages
    {
        private readonly ActivityImagesManager _activityActivityImages = new ActivityImagesManager();

        [Authorize]
        [HttpPost]
        [Route("activityimages")]
        public IHttpActionResult CreateActivityImages(ActivityImagesRequest activityImagesRequest)
        {
                _activityActivityImages.CreateActivityImages(activityImagesRequest);
                return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("activityimages/{id:Guid}")]
        public IHttpActionResult GetActivityImages(Guid id)
        {
            return Ok(_activityActivityImages.GetActivityImages(id));
        }
    }
}
