using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class DemandPublishRequest:SearchRequest
    {
        public string Status { get; set; }
        public Nullable<System.DateTime> ExpiryDate { get; set; } 
    }
    public class DemandPublishCreateRequest
    {
        public bool IsAdmin { get; set; }
        public DemandPublish DemandPublish { get; set; }
    }
    public class DemandPublishUpdateRequest 
    {
        public bool IsAdmin { get; set; }
        public DemandPublish DemandPublish { get; set; }
    }

    public class DemandPublishApproveRequest
    {
        public Guid Id { get; set; }
        public string ApproveStatus { get; set; }

        public string Comments { get; set; }
    }
}