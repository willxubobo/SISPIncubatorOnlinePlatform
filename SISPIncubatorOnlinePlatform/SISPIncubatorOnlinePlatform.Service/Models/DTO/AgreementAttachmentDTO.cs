using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class AgreementAttachmentDTO
    {
        public System.Guid AttachementID { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public System.Guid IncubatorApplyID { get; set; }
        public Nullable<System.DateTime> Created { get; set; }
        public Nullable<System.Guid> CreatedBy { get; set; }
    }
}