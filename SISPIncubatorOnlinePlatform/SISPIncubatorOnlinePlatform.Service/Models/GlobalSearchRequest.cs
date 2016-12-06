using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class GlobalSearchRequest:SearchRequest
    {
        public string KeyWord { get; set; }
    }
}