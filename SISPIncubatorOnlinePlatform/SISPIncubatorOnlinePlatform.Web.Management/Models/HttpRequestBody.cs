using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Management.Models 
{
    public class HttpRequestBody
    {
        //对应后端Service API的真实Uri
        public string requestUri { get; set; }

        //需要传到后端Service API中的相关参数
        public object requestParameters { get; set; }
    }
}