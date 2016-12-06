using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class RolesRequest:SearchRequest
    {
        public string KeyWord { get; set; }
        public string Type { get; set; }
    }

    public class RolesCreateRequest
    {
        public Roles Roles { get; set; }
    }
}