using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class AgreementTemplateDTO
    {
        public System.Guid AttachmentID { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public System.Guid IncubatorID { get; set; }
        public Nullable<System.DateTime> Created { get; set; }
        public Nullable<System.Guid> CreatedBy { get; set; }
    }
}