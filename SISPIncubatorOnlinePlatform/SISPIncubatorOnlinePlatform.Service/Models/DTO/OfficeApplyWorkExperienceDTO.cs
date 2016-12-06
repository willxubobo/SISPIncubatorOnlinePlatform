using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class OfficeApplyWorkExperienceDTO
    {
        public System.Guid WEID { get; set; }
        public System.Guid ApplyID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string SchoolOrEmployer { get; set; }
        public string JobTitle { get; set; }
    }
}