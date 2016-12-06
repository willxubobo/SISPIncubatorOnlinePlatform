using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class DictionaryDTO
    {
        public System.Guid ID { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public string Status { get; set; }
        public Nullable<decimal> Sort { get; set; }

        public bool  IsExistData { get; set; }
    }
}