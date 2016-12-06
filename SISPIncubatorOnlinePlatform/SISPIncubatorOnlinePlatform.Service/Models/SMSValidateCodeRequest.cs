using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class SMSValidateCodeRequest:SearchRequest
    {
        public string Phone { get; set; }
        public DateTime CreateDate { get; set; }
    }

    public class SMSValidateCodeCeateRequest
    {
        public SMSValidateCode SmsValidateCode { get; set; }
    }
}