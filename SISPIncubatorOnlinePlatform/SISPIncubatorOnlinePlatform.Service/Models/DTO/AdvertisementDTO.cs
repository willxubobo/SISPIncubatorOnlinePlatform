using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class AdvertisementDTO
    {
        public System.Guid AdID { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public string Url { get; set; }
        public int Hits { get; set; }
        public string Status { get; set; }

        public Nullable<decimal> Sort { get; set; }

        public string StatusDes { get; set; }

        public string Module { get; set; }

        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }

        public bool IsShow { get; set; }
    }
}