using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Management.Models
{
    public class ResponseContentError
    {
        public string Error { get; set; }
        public string Error_Description { get; set; }
        public string ErrorUri { get; set; }
    }
}