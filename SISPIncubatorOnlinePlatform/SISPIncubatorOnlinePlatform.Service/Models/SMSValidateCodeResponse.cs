using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class SMSValidateCodeResponse : BusinessResponse<SMSValidateCodeDTO>
    {
        [DataMember]
        public Guid ID { get; set; }
        [DataMember]
        public string ValidateCode { get; set; }
        [DataMember]
        public string ValidateCodeRight { get; set; }
    }

}