using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IAdvertisement
    {
        IHttpActionResult CreateAdvertisement(AdvertisementCreateRequest advertisementCreateRequest);
        IHttpActionResult GetAdvertisement(Guid AdID);
        IHttpActionResult GetAdvertisements(AdvertisementRequest conditions);
        IHttpActionResult UpdateAdvertisement(AdvertisementCreateRequest advertisementCreateRequest);
        IHttpActionResult DeleteAdvertisement(Guid AdID);
    }
}
