using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class AdvertisementRequest:SearchRequest
    {
        public string Type { get; set; }
    }

    public class AdvertisementCreateRequest
    {
        public Advertisement Advertisement { get; set; }
    }
    public class AdvertisementDeleteRequest
    {
        public string Ads { get; set; }
    }
}