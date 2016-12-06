using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class OfficeApplyRequest : SearchRequest
    {
        public string OperModel { get; set; }
        public string KeyWord { get; set; }
        public string Status { get; set; }
    }

    public class OfficeApplyCreateRequest
    {
        public OfficeApply OfficeApply { get; set; }

        public string ApproveStatus { get; set; }

        public string Comments { get; set; }
    }


    public class OfficeApplyDeleteRequest
    {
        public string ApplyIds { get; set; }
    }
}