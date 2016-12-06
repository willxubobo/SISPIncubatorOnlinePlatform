using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class DictionaryActivityResponse 
    {
        [DataMember]
        public Dictionary<String, IList<DictionaryDTO>> Results { get; set; }
    }
}