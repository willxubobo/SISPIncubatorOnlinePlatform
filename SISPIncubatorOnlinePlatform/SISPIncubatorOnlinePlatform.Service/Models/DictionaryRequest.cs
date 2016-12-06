using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class DictionaryRequest : SearchRequest
    {
        [DataMember]
        public string Key { get; set; }
        [DataMember]
        public string KeyWord { get; set; }
        public string ModuleType { get; set; }
    }

    public class DictionaryCreateRequest
    {
        public Dictionary Dictionary { get; set; }
    }
}