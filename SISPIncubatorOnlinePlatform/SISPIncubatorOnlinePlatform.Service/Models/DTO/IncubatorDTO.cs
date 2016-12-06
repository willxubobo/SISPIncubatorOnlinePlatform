using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class IncubatorDTO
    {
        public System.Guid IncubatorID { get; set; }
        public string IncubatorName { get; set; }
        public string OperationAddress { get; set; }
        public string RegTime { get; set; }
        public string Logo { get; set; }
        public bool FinancialSupport { get; set; }
        public string Description { get; set; }
        public string Service { get; set; }
        public string SiteFavorable { get; set; }
        public string OtherService { get; set; }    
        public string IndustryRequirement { get; set; }
        public string LocationRequirement { get; set; }
        public string OtherRequirement { get; set; }
        public System.Guid RoleID { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }

        public Nullable<decimal> Sort { get; set; }
        public Nullable<bool> IsShow { get; set; }

        public Nullable<bool> IsDelete { get; set; }
        public virtual List<IncubatorProjectsDTO> IncubatorProjects { get; set; }

        public AgreementTemplateDTO AgreementTemplateDto { get; set; }
    }
}