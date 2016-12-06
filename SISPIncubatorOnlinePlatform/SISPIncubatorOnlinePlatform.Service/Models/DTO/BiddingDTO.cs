using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class BiddingDTO
    {
        public System.Guid ID { get; set; }
        public string CompanyName { get; set; }
        public string Industry { get; set; }
        public string Description { get; set; }
        public int Category { get; set; }
        public string ImgUrl { get; set; }
        public string IndustryName { get; set; }
    }
}