using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class OfficeApplyDTO
    {
        public System.Guid ApplyID { get; set; }
        public string ProjectOwner { get; set; }
        public string Gender { get; set; }
        public string Degree { get; set; }
        public string Specialty { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Diplomas { get; set; }
        public string IntellectualProperty { get; set; }
        public string CompanyName { get; set; }
        public decimal RegisteredCapital { get; set; }
        public decimal DemandForSpace { get; set; }
        public int InitialStaff { get; set; }
        public string ProductDescription { get; set; }
        public string MemberDescription { get; set; }
        public string FinancingAndRevenue { get; set; }
        public string ApplyStatus { get; set; }
        public string ApplyStatusDes { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }

        public virtual List<OfficeApplyWorkExperienceDTO> OfficeApplyWorkExperienceDtos { get; set; }

        public string CreatedDate { get; set; }

        public List<ApproveRecordDTO> ApproveRecords { get; set; }

        public string AppDate { get; set; }

        public string AppUserName { get; set; }
    }
}