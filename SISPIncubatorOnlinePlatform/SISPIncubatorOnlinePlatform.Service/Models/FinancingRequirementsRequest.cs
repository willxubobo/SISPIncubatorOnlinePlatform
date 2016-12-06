using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;


namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class FinancingRequirementsRequest : SearchRequest
    {
        public string ProductionName { get; set; }
        public string KeyWord { get; set; }
        public string IsAll { get; set; }
        public string ApproveList { get; set; }
        public string Status { get; set; }

    }

    public class FinancingRequirementsCreateRequest
    {
        public FinancingRequirements FinancingRequirements { get; set; }

        public WeiXinRequest WeiXinRequest { get; set; }
        public string AddType { get; set; }
    }
}