using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class LinkListRequest : SearchRequest
    {
        public string KeyWord { get; set; }
    }

    public class LinkListCreateRequest
    {
        public LinkList LinkList { get; set; }
    }
}