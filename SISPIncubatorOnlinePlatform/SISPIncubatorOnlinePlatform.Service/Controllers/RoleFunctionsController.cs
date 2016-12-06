using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class RoleFunctionsController : BaseController
    {
        RoleFunctionsManager _roleFunctionsManager=new RoleFunctionsManager();

        [SSIPActionFilter]
        [Authorize]
        [HttpPost]
        [Route("rolefunction")]
        public IHttpActionResult CreateRoleFunction(Models.RoleFunctionsRequest roleFunctionsRequest)
        {
            _roleFunctionsManager.CreateRoleFunctions(roleFunctionsRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpPost]
        [Route("rolefunctions")]
        public IHttpActionResult GetRoleFunctions(Models.RoleFunctionsRequest roleFunctionsRequest)
        {
            RoleFunctionsResponse roleFunctionsResponse = new RoleFunctionsResponse();
            List<Entities.Role_Functions> list = _roleFunctionsManager.GetAll(roleFunctionsRequest);
            List<RoleFunctionsDTO> dtoList = new List<RoleFunctionsDTO>();
            Utility.CopyList<Entities.Role_Functions, RoleFunctionsDTO>(list, dtoList);

            roleFunctionsResponse.Results = dtoList;
            roleFunctionsResponse.TotalCount = dtoList.Count;

            return Ok(roleFunctionsResponse);
        }
    }
}
