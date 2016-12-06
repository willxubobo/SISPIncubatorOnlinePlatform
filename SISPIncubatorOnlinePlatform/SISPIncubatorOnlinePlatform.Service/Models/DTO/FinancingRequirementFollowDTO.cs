using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class FinancingRequirementFollowDTO
    {
        public System.Guid FollowID { get; set; }
        public System.Guid FRID { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
        public string ProductionName { get; set; }
        public string ProjectLogo { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string FollowType { get; set; }
        public string Industry { get; set; }
        public decimal FinancingAmount { get; set; }
    }

    /// <summary>
    /// 融资项目关注
    /// </summary>
    public class MyFinancingRequirementFollowDTO
    {
        public System.Guid FollowID { get; set; }
        public System.Guid FRID { get; set; }
        public string ProductionName { get; set; }
        public string Industry { get; set; }
        public decimal FinancingAmount { get; set; }
        public string IndustryName { get; set; }
        public string UserName { get; set; }
        public System.Guid UserID { get; set; }
    }

    /// <summary>
    /// 投资机构关注
    /// </summary>
    public class MyInvestorFollowDTO
    {
        public System.Guid FollowID { get; set; }
        public System.Guid FRID { get; set; }
        public string CompanyName { get; set; }
        public string InvestmentField { get; set; }
        public string FundScale { get; set; }
        public string UserName { get; set; }
        public System.Guid UserID { get; set; }
    }

    public class MyFansDTO
    {
        public Guid UserID { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; }
        public string Email { get; set; }
        public DateTime Created { get; set; }
    }
}