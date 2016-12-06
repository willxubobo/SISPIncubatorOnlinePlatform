using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class IncubatorApplyDTO
    {
        public System.Guid ApplyID { get; set; }
        public string ProjectName { get; set; }
        public string CompanyName { get; set; }
        public string CompanyTel { get; set; }
        public string ProjectOwner { get; set; }
        public string ContactTel { get; set; }
        public string Email { get; set; }
        public string TeamMembers { get; set; }
        public string ProductDescription { get; set; }
        public string CoreStaffResume { get; set; }
        public string MarketRiskAnalysis { get; set; }
        public string FinancingSituation { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }

        public System.Guid IncubatorID { get; set; }
        public string ApplyStatus { get; set; }
        public Nullable<bool> IsSign { get; set; }
        public string IncubatorName { get; set; }

        public string IncubatorLogoPath { get; set; }

        public string AppUserName { get; set; }

        public string AppDate { get; set; }

        public string ApplyStatusDes { get; set; }

        public List<ApproveRecordDTO> ApproveRecords { get; set; }

        public List<AgreementAttachmentDTO> ListAttachments { get; set; }

        public AgreementTemplateDTO AgreementTemplate { get; set; }

        public string UserType { get; set; }
    }
}