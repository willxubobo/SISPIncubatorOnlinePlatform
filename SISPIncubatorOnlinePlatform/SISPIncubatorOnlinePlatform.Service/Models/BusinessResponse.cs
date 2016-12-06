using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    [DataContract(Namespace = "http://boschxml.org/rb/pt/warranty/claim")]
    public class BusinessResponse<T> where T : class
    {
        [DataMember]
        public Dictionary<string, object> AdditionalParameters { get; set; }
        [DataMember]
        public int TotalCount { get; set; }
        [DataMember]
        public IList<T> Results { get; set; }
        [DataMember]
        public int TotalPage { get; set; }
    }
}