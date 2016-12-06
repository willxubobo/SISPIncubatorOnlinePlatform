using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class DictionaryActivityRequest
    {
        [DataMember]
        public string Industry { get; set; }
        [DataMember]
        public string Free { get; set; }
        [DataMember]
        public string ChargeItem { get; set; }
    }
}