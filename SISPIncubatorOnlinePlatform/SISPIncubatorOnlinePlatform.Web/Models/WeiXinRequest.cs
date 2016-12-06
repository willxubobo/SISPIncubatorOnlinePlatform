using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Models
{
    public class WeiXinRequest
    {
        public WeiXinRequest(string Code, string OpenID)
        {
            this.Code = Code;
            this.OpenID = OpenID;
        }
        public string Code { get; set; }
        public string OpenID { get; set; }
    }
}