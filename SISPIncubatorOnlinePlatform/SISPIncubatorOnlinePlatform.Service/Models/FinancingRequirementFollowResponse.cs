using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class FinancingRequirementFollowResponse : BusinessResponse<FinancingRequirementFollowDTO>
    {
        public System.Guid FollowID { get; set; }
    }

    /// <summary>
    /// 项目融资关注
    /// </summary>
    public class MyFinancingRequirementFollowResponse : BusinessResponse<MyFinancingRequirementFollowDTO>
    {
        public System.Guid FollowID { get; set; }
    }

    public class MyInvestorFollowResponse : BusinessResponse<MyInvestorFollowDTO>
    {
        public System.Guid FollowID { get; set; }
    }
    public class MyFansResponse : BusinessResponse<MyFansDTO>
    {
    }

}