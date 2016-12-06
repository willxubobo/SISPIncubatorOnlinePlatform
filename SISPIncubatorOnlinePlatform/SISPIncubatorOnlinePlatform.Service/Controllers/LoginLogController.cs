using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class LoginLogController : ApiController
    {
        [HttpPost]
        [Route("loginlog")]
        public IHttpActionResult CreateLoginLog(LoginLog loginLog)
        {
            LoginLogManager loginLogManager = new LoginLogManager();
            loginLogManager.Add(loginLog);
            return Ok();
        }
    }
}
