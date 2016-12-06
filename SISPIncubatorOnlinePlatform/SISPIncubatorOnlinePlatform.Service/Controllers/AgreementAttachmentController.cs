using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class AgreementAttachmentController : BaseController
    {
        [Authorize]
        [HttpPost]
        [Route("agreementattachment")]
        public IHttpActionResult CreateAgreementAttachment()
        {
            AgreementAttachmentManagement agreementAttachmentManagement=new AgreementAttachmentManagement();
            agreementAttachmentManagement.AddAgreementAttachment();
            UploadFileDTO userResponse = new UploadFileDTO();

            userResponse.HeadImgUrl = "success";
            return Ok(userResponse);
        }
        [Authorize]
        [HttpPost]
        [Route("agreementtemplate")]
        public IHttpActionResult CreateAgreementTemplate()
        {
            AgreementAttachmentManagement agreementAttachmentManagement = new AgreementAttachmentManagement();
            agreementAttachmentManagement.AddAgreementTemplate();
            UploadFileDTO userResponse = new UploadFileDTO();
            userResponse.HeadImgUrl = "success";
            return Ok(userResponse);
        }
    }
}
