using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class FunctionsRequest : SearchRequest
    {
        public string ParentID { get; set; }
    }
}