using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IDemandPublish
    {
        IHttpActionResult CreateDemandPublish(DemandPublishCreateRequest demandPublishDto);
        IHttpActionResult GetDemandPublish(Guid id);
        IHttpActionResult GetDemandPublishs(DemandPublishRequest conditions);
        IHttpActionResult UpdateDemandPublish(DemandPublishUpdateRequest demandPublishDto);
        IHttpActionResult DeleteDemandPublish(Guid id);
        IHttpActionResult GetBiddings();
        IHttpActionResult GetMyDemandPublishs(DemandPublishRequest conditions);
    }
}
