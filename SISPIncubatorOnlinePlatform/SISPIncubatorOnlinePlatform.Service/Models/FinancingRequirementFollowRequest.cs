using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class FinancingRequirementFollowRequest : SearchRequest
    {
    }

    public class FinancingRequirementFollowCreateRequest
    {
        public FinancingRequirementFollow FinancingRequirementFollow { get; set; }
    }
}