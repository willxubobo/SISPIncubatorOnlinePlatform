using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class InvestorInformationDTO
    {
        public System.Guid UserID { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string FundScale { get; set; }
        public string InvestmentField { get; set; }
        public string InvestorName { get; set; }
        public string Email { get; set; }
        public string InvestmentStage { get; set; }
        public string Address { get; set; }
        public string InvestmentCase { get; set; }
        public string Status { get; set; }
        public System.DateTime Created { get; set; }
        public System.Guid? CreatedBy { get; set; }
        public int FollowCount { get; set; }
        public bool IsFollowed { get; set; }
        public System.Guid? FollowID { get; set; }
        public string UserName { get; set; }
        public Nullable<bool> IsShow { get; set; }
        public string InvestmentStageName { get; set; }
    }
}