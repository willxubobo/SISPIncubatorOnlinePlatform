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
    public class AdvertisementController : BaseController, IAdvertisement
    {
        private readonly AdvertisementManager _advertisementManager = new AdvertisementManager();

        [Authorize]
        [HttpPost]
        [SSIPActionFilter]
        [Route("advertisement")]
        public IHttpActionResult CreateAdvertisement(AdvertisementCreateRequest advertisementCreateRequest)
        {
             _advertisementManager.CreateAdvertisement(advertisementCreateRequest);
            return Ok();
        }
        [Authorize]
        [HttpPost]
        [Route("advertisementandfile")]
        public IHttpActionResult CreateAdvertisement()
        {
            _advertisementManager.CreateAdvertisement();
            UploadFileDTO userResponse = new UploadFileDTO();
            userResponse.HeadImgUrl = "success";
            return Ok(userResponse);
        }

        [HttpGet]
        [ResponseType(typeof(AdvertisementResponse))]
        [Route("advertisement/{id:Guid}")]
        public IHttpActionResult GetAdvertisement(Guid id)
        {
            AdvertisementResponse advertisementResponse = new AdvertisementResponse();
            List<AdvertisementDTO> list = _advertisementManager.GetAdvertisementById(id);
            advertisementResponse.Results = list;
            return Ok(advertisementResponse);
        }

        [HttpPost]
        [Route("advertisements")]
        public IHttpActionResult GetAdvertisements(AdvertisementRequest conditions)
        {
            AdvertisementResponse advertisementResponse = new AdvertisementResponse();
            int total = 0;
            List<AdvertisementDTO> advertisements = _advertisementManager.GetAll(conditions, out total);
            advertisementResponse.Results = advertisements;
            advertisementResponse.TotalCount = total;
            return Ok(advertisementResponse);
        }

        [Authorize]
        [HttpPost]
        [SSIPActionFilter]
        [Route("advertisements/pcdm")]
        public IHttpActionResult DeleteAdvertisements(AdvertisementDeleteRequest advertisementDeleteRequest)
        {
            _advertisementManager.DeleteAavertisementsManage(advertisementDeleteRequest);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        [SSIPActionFilter]
        [Route("advertisement")]
        public IHttpActionResult UpdateAdvertisement(AdvertisementCreateRequest advertisementCreateRequest)
        {
            _advertisementManager.UpdateAdvertisement(advertisementCreateRequest);
            return Ok();
        }

        [HttpPost]
        [Route("advertisement/{id:Guid}")]
        public IHttpActionResult AddAdvertisementTraffic(Guid id)
        {
            _advertisementManager.AddTraffic(id);
            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [SSIPActionFilter]
        [Route("advertisement/{id:Guid}")]
        public IHttpActionResult DeleteAdvertisement(Guid id)
        {
            _advertisementManager.DeleteAdvertisement(id);
            return Ok();
        }
    }
}
