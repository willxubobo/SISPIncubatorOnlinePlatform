using SISPIncubatorOnlinePlatform.Service.CustomAttribute;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Managers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [DeflateCompression]
    [ExceptionHandler]
    public class BaseController : ApiController
    {
        private readonly static bool isRequestRecord = bool.Parse(ConfigurationManager.AppSettings["RequestRecordSwitch"].ToString());

        public BaseController()
        {
            //记录客户端请求的相关数据
            if (isRequestRecord)
            {
                new RequestRecordsManager().CreateRequestRecords();
            }            
        }
    }
}