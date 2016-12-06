using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class InvestorInformationRequest:SearchRequest
    {
        public string CompanyName { get; set; }
        public string KeyWord { get; set; }
        public string IsAll { get; set; }
        public string ApproveList { get; set; }
        public string Status { get; set; }
    }

    public class InvestorInformationCreateRequest
    {
        public InvestorInformation InvestorInformation { get; set; }

        public WeiXinRequest WeiXinRequest { get; set; }
        public string AddType { get; set; }
    }
}