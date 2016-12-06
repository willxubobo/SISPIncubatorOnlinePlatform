using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivitySignUpRequest : SearchRequest
    {
        public Guid ActivityId { get; set; }
    }
    public class ActivitySignUpCreateRequest
    {
        public ActivitySignUp ActivitySignUp { get; set; }
    }
    public class ActivitySignUpUpdateRequest
    {
        public ActivitySignUp ActivitySignUp { get; set; }
    }
}