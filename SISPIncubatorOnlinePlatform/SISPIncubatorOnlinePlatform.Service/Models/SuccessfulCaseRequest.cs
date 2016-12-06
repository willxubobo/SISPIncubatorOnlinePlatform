using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class SuccessfulCaseRequest:SearchRequest
    {
        public string Status { get; set; }
    }

    public class SuccessfulCaseCreateRequest
    {
        public SuccessfulCase SuccessfulCase { get; set; }
    }
}