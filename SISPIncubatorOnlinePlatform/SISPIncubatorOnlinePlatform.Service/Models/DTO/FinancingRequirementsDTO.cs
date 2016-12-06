using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class FinancingRequirementsDTO
    {
        public System.Guid FRID { get; set; }
        public string ProductionName { get; set; }
        public string ProjectLogo { get; set; }
        public string CompanyDescription { get; set; }
        public string ProductionDescription { get; set; }
        public string Industry { get; set; }
        public string IndustryName { get; set; }
        public decimal FinancingAmount { get; set; }
        public string Status { get; set; }
        public string DevelopmentalStage { get; set; }
        public string MarketAnalysis { get; set; }
        public string OtherInfo { get; set; }
        public string CoreTeam { get; set; }
        public System.Guid? CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
        public int FollowCount { get; set; }
        public bool IsFollowed { get; set; }
        public System.Guid? FollowID { get; set; }
        public string UserName { get; set; }
        public Nullable<bool> IsShow { get; set; }
        public System.Guid UserID { get; set; }
        public List<ApproveRecordDTO> ApproveRecords { get; set; }

        public string PermissionControl { get; set; }
    }
}