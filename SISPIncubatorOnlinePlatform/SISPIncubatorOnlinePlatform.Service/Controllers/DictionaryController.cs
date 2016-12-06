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
    public class DictionaryController : BaseController
    {
        //[Authorize]
        [HttpPost]
        [Route("informations")]
        public IHttpActionResult GetInformations(DictionaryRequest conditions)
        {
            DictionaryResponse dictionaryResponse = new DictionaryResponse();

            DictionaryManager incubatorApplyManager = new DictionaryManager();
            List<Dictionary> list = incubatorApplyManager.GetAll(conditions);

            List<DictionaryDTO> dtoList = new List<DictionaryDTO>();
            Utility.CopyList<Dictionary, DictionaryDTO>(list, dtoList);

            dictionaryResponse.Results = dtoList;
            dictionaryResponse.TotalCount = list.Count;            

            return Ok(dictionaryResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("dictionarys")]
        public IHttpActionResult GetDictionarys(DictionaryRequest conditions)
        {
            DictionaryResponse dictionaryResponse = new DictionaryResponse();
            int TotalCount;
            DictionaryManager incubatorApplyManager = new DictionaryManager();
            List<DictionaryDTO> dtoList = incubatorApplyManager.GetAllByType(conditions, out TotalCount);

            dictionaryResponse.Results = dtoList;
            dictionaryResponse.TotalCount = TotalCount;

            return Ok(dictionaryResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("information")]
        public IHttpActionResult CreateInformation(DictionaryCreateRequest dictionaryCreateRequest)
        {
            DictionaryManager incubatorApplyManager = new DictionaryManager();
            incubatorApplyManager.Create(dictionaryCreateRequest);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("information")]
        public IHttpActionResult UpdateInformation(DictionaryCreateRequest dictionaryCreateRequest)
        {

            DictionaryManager incubatorApplyManager = new DictionaryManager();

            incubatorApplyManager.Update(dictionaryCreateRequest);

            return Ok();
        }

        [Authorize]
        [HttpDelete]
        [Route("information/{id:Guid}")]
        public IHttpActionResult DeleteInformation(Guid id)
        {

            DictionaryManager incubatorApplyManager = new DictionaryManager();

            incubatorApplyManager.Delte(id);

            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("information/{id:Guid}")]
        public IHttpActionResult GetInformation(Guid id)
        {

            DictionaryManager incubatorApplyManager = new DictionaryManager();

            Dictionary dictionary=incubatorApplyManager.GetInformation(id);

            Dictionary<string, string> userProperties = null;
            if (dictionary != null)
            {
                
                userProperties = new Dictionary<string, string>
                {
                    {
                      "key_id", dictionary.ID.ToString()
                    },
                    {
                      "key_name", dictionary.Key
                    },
                    {
                      "key_value", dictionary.Value
                    },
                    {
                      "key_sort", dictionary.Sort.ToString()
                    }
                };
            }

            return Ok(userProperties);
        }

        //[Authorize]
        [HttpPost]
        [Route("informations/activity")]
        public IHttpActionResult GetInformationByActivity(DictionaryActivityRequest conditions)
        {
            DictionaryActivityResponse dictionaryResponse = new DictionaryActivityResponse();
            dictionaryResponse.Results=new Dictionary<string, IList<DictionaryDTO>>();
            DictionaryManager incubatorApplyManager = new DictionaryManager();
            List<Dictionary> industryList = incubatorApplyManager.GetAll(conditions.Industry);
            List<DictionaryDTO> dtoIndustryList = new List<DictionaryDTO>();
            Utility.CopyList<Dictionary, DictionaryDTO>(industryList, dtoIndustryList);
            dictionaryResponse.Results.Add(conditions.Industry, dtoIndustryList);
            List<Dictionary> freeList = incubatorApplyManager.GetAll(conditions.Free);
            List<DictionaryDTO> dtoFeeList = new List<DictionaryDTO>();
            Utility.CopyList<Dictionary, DictionaryDTO>(freeList, dtoFeeList);
            dictionaryResponse.Results.Add(conditions.Free, dtoFeeList);
            List<Dictionary> chargeItemList = incubatorApplyManager.GetAll(conditions.ChargeItem);
            List<DictionaryDTO> dtoChargeItemList = new List<DictionaryDTO>();
            Utility.CopyList<Dictionary, DictionaryDTO>(chargeItemList, dtoChargeItemList);
            dictionaryResponse.Results.Add(conditions.ChargeItem, dtoChargeItemList);
            return Ok(dictionaryResponse);
        }
    }
}
