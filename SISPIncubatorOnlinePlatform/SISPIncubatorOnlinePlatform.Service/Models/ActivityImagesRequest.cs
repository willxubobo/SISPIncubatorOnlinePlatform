using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivityImagesRequest
    {
        public ActivityImagesDTO ActivityImages { get; set; }
        public WeiXinRequest WeiXinRequest { get; set; }
        public string DelImgs { get; set; }
    }
}