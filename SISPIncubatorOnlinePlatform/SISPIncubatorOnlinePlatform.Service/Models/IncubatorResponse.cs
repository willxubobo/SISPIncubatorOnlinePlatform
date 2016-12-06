using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class IncubatorResponse : BusinessResponse<IncubatorDTO>
    {
        [DataMember]
        public System.Guid ID { get; set; }
    }


    public class IncubatorProjectReportResponse : BusinessResponse<IncubatorProjectReportDTO>
    {
        [DataMember]
        public System.Guid ID { get; set; }
    }
}