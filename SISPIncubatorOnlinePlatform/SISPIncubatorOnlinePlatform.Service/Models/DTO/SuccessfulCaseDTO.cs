using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class SuccessfulCaseDTO
    {
        public System.Guid CaseID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Picture { get; set; }
        public string Category { get; set; }
        public Nullable<bool> Status { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
    }
}