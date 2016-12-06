using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ApproveRecordDTO
    {
        public System.Guid RecordID { get; set; }
        public System.Guid ApproveRelateID { get; set; }
        public string ApproveNode { get; set; }
        public string Comments { get; set; }
        public string ApproveResult { get; set; }
        public System.Guid Approver { get; set; }
        public string ApplyType { get; set; }
        public System.Guid Applicant { get; set; }
        public System.DateTime Created { get; set; }

        public string CreatedDate { get; set; }

        public string ApproverUser { get; set; }

        public string ApplicantUserName { get; set; }
    }
}