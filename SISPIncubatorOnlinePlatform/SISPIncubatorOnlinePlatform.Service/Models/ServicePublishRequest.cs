using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ServicePublishRequest : SearchRequest
    {
        public string Status { get; set; }
        public Nullable<System.DateTime> ExpiryDate { get; set; } 
    }
    public class ServicePublishCreateRequest
    {
        public bool IsAdmin { get; set; }
        public ServicePublish ServicePublish { get; set; }
    }
    public class ServicePublishUpdateRequest
    {
        public bool IsAdmin { get; set; }
        public ServicePublish ServicePublish { get; set; }
    }

    public class ServicePublishApproveRequest
    {
        public Guid Id { get; set; }
        public string ApproveStatus { get; set; }

        public string Comments { get; set; }
    }
}