using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ApproveRecordRequest:SearchRequest
    {
        public string ApproveRelateID { get; set; }
        public string ApplyType { get; set; }
        public string ApproveStatus { get; set; }
        public string Comments { get; set; }
    }
}