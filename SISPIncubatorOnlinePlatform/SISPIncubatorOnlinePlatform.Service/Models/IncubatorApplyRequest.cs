using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class IncubatorApplyRequest : SearchRequest
    {
        public string IncubatorTypeRole { get; set; }
        public string KeyWord { get; set; }
        public string Status { get; set; }
    }

    public class IncubatorApplyCreateRequest
    {
        public IncubatorApply IncubatorApply { get; set; }
        public string Incubators { get; set; }
        public string ApproveStatus { get; set; }

        public string Comments { get; set; }
    }

    public class IncubatorApplyDeleteRequest
    {
        //需要删除的编号：id|id|id
        public string ApplyIds { get; set; }
    }
}