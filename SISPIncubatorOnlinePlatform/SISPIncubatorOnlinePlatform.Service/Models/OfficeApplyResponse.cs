using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class OfficeApplyResponse : BusinessResponse<OfficeApplyDTO>
    {
        [DataMember]
        public System.Guid ID { get; set; }
    }
}