using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class LinkListDTO
    {
        public System.Guid LinkID { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public bool Status { get; set; }
        public Nullable<decimal> Sort { get; set; }
        public System.DateTime Created { get; set; }
        public System.Guid CreatedBy { get; set; }
    }
}