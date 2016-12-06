using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class AgreementAttachmentRequest
    {
        public string  IncubatorApplyId { get; set; }

        public string DeleteIds { get; set; }

        public List<HttpPostedFileBase> files { get; set; }
    }
}