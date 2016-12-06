using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class MessageResponse : BusinessResponse<MessageDTO>
    {
        [DataMember]
        public System.Guid Id { get; set; }

        [DataMember]
        public System.Guid UserId { get; set; }
    }

    public class MessageResponseChartDTO : BusinessResponse<MessageChartDTO>
    {
        [DataMember]
        public System.Guid Id { get; set; }

        [DataMember]
        public System.Guid UserId { get; set; }
    }
}