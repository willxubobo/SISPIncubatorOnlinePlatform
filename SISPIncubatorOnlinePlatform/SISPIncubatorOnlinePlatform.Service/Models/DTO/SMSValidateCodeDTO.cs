using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class SMSValidateCodeDTO
    {
        public System.Guid ID { get; set; }
        public string Mobile { get; set; }
        public string Code { get; set; }
        public System.DateTime Created { get; set; }
    }
}