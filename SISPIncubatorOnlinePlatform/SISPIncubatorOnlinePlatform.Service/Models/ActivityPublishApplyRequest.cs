using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivityPublishApplyRequest : SearchRequest
    {
    }
    public class ActivityPublishApplyCreateRequest
    {
        public bool IsAdmin { get; set; }
        public ActivityPublishApply ActivityPublishApply { get; set; }
    }
    public class ActivityPublishApplyUpdateRequest
    {
        public bool IsAdmin { get; set; }
        public ActivityPublishApply ActivityPublishApply { get; set; }
    }
    public class ActivityPublishApplyApproveRequest
    {
        public Guid Id { get; set; }
        public string Category { get; set; }
        public string ApproveStatus { get; set; }

        public string Comments { get; set; }
    }
}