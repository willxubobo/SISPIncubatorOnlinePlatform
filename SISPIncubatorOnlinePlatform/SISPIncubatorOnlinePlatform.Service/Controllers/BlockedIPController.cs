using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class BlockedIPController : BaseController
    {
        [HttpPost]
        [Route("blockedip")]
        public IHttpActionResult CreateBlockedip(BlockedIP blockedIp)
        {
            BlockedIpManager blockedIpManager = new BlockedIpManager();
            blockedIpManager.Add(blockedIp);
            return Ok();
        }
        [HttpGet]
        [Route("blockedips")]
        public IHttpActionResult GetBlockedIP(BlockedIP blockedIp)
        {
            BlockedIpManager blockedIpManager = new BlockedIpManager();
            return Ok(blockedIpManager.GetAll());
        }
    }
}
