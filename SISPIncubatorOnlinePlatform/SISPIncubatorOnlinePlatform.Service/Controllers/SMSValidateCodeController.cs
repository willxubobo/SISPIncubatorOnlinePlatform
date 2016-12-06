using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class SMSValidateCodeController : BaseController, ISMSValidateCode
    {
        [HttpPost]
        [Route("validatecode")]
        public IHttpActionResult CreateValidateCode(SMSValidateCodeCeateRequest dictionaryCreateRequest)
        {
            SMSValidateCodeResponse smsValidateCodeResponse = new SMSValidateCodeResponse();

            SMSValidateCodeManager smsValidateCodeManager = new SMSValidateCodeManager();
            string code = string.Empty;
            smsValidateCodeManager.Add(dictionaryCreateRequest, out code);

            smsValidateCodeResponse.ValidateCode = code;

            return Ok(smsValidateCodeResponse);
        }

        [HttpPost]
        [Route("validatecodes")]
        public IHttpActionResult GetValidateCodes(SMSValidateCodeRequest conditions)
        {
            SMSValidateCodeResponse smsValidateCodeResponse = new SMSValidateCodeResponse();

            SMSValidateCodeManager incubatorApplyManager = new SMSValidateCodeManager();
            List<SMSValidateCode> list = incubatorApplyManager.GetAll(conditions);

            List<SMSValidateCodeDTO> dtoList = new List<SMSValidateCodeDTO>();
            Utility.CopyList<SMSValidateCode, SMSValidateCodeDTO>(list, dtoList);
            smsValidateCodeResponse.Results = dtoList;

            smsValidateCodeResponse.TotalCount = list.Count;

            return Ok(smsValidateCodeResponse);
        }

        [HttpDelete]
        [Route("validatecode/{id:Guid}")]
        public IHttpActionResult DeleteValidateCodes(Guid id)
        {

            SMSValidateCodeManager smsValidateCodeManager = new SMSValidateCodeManager();
            smsValidateCodeManager.Delete(id);

            return Ok();
        }

        [HttpPost]
        [Route("validatecode/check")]
        public IHttpActionResult GetValidateCode(SMSValidateCodeCeateRequest dictionaryCreateRequest)
        {
            SMSValidateCodeResponse smsValidateCodeResponse = new SMSValidateCodeResponse();

            SMSValidateCodeManager incubatorApplyManager = new SMSValidateCodeManager();
            if (incubatorApplyManager.CheckValidateCode(dictionaryCreateRequest))
            {
                smsValidateCodeResponse.ValidateCodeRight = "Right";
            }
            else
            {
                smsValidateCodeResponse.ValidateCodeRight = "Error";
            }

            return Ok(smsValidateCodeResponse);
        }
    }
}
