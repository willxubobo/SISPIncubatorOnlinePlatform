using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
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
    public class FunctionsController : BaseController, IFunctions
    {
        private readonly FunctionsManager _functionsManager = new FunctionsManager();

        [Authorize]
        [HttpPost]
        [Route("functions")]
        public IHttpActionResult GetParentFunctions(FunctionsRequest functionsRequest)
        {
            FunctionsResponse functionsResponse = new FunctionsResponse();
            List<FunctionsDTO> dtoList = _functionsManager.GetParentFunctions(functionsRequest);
            functionsResponse.Results = dtoList;
            return Ok(functionsResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("leftfunctions")]
        public IHttpActionResult GetItemFunctions(FunctionsRequest functionsRequest)
        {
            FunctionsResponse functionsResponse = new FunctionsResponse();
            List<FunctionsDTO> dtoList = _functionsManager.GetItemFunctions(functionsRequest);
            functionsResponse.Results = dtoList;
            return Ok(functionsResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("functions/all")]
        public IHttpActionResult GetFunctions(FunctionsRequest functionsRequest)
        {
            FunctionsResponse functionsResponse = new FunctionsResponse();
            List<FunctionsDTO> dtoList = _functionsManager.GetFunctions(functionsRequest);
            functionsResponse.Results = dtoList;
            return Ok(functionsResponse);
        }
    }
}
