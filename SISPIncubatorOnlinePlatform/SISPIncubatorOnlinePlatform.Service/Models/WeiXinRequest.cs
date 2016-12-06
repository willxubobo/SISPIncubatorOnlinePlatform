using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class WeiXinRequest
    {
        public string Code { get; set; }
        public string PageUrl { get; set; }

        public string MediaID { get; set; }

        public string SavePath { get; set; }

        public string FileName { get; set; }
        public string OpenID { get; set; }
    }
}