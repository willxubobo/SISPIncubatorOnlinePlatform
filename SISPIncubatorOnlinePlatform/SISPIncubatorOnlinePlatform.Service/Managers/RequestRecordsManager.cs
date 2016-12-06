using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class RequestRecordsManager : BaseManager
    {
        public void CreateRequestRecords()
        {
            //当前请求的用户（手机号）
            string user = HttpContext.Current.User.Identity.Name;
            //标记该请求是来至于哪个客户端，微信或者PC
            string clientType = HttpContext.Current.Request.Headers.Get("ClientType");
            //客户端浏览器Agent
            string userAgent = HttpContext.Current.Request.UserAgent;
            //客户端IP地址
            string userHostAddress = HttpContext.Current.Request.UserHostAddress;
            //当前请求的URL
            string requestUri = HttpContext.Current.Request.Url.AbsoluteUri;
            //当前请求的Http Method
            string httpMethod = HttpContext.Current.Request.HttpMethod;

            RequestRecords record = new RequestRecords();
            record.ClientType = clientType;
            record.User = user;
            record.UserAgent = userAgent;
            record.UserHostAddress = userHostAddress;
            record.RequestUri = requestUri;
            record.HttpMethod = httpMethod;
            record.RequestTime = DateTime.Now;

            SISPIncubatorOnlinePlatformEntitiesInstance.RequestRecords.Add(record);           
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }
    }
}