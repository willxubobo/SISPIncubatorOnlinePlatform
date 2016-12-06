using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivitySignUpResponse : BusinessResponse<ActivitySignUpDTO>
    {
        [DataMember]
        public System.Guid Id { get; set; }
    }


    public class ActivitySignUpStatsResponse : BusinessResponse<ActivitySignUpStatsDTO>
    {
        
    }
}