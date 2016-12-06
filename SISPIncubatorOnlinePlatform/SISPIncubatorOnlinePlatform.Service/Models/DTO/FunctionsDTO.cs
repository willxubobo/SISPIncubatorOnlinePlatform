using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class FunctionsDTO
    {
        public System.Guid FunctionID { get; set; }
        public string FunctionName { get; set; }
        public string Controller { get; set; }
        public bool Status { get; set; }
        public string Description { get; set; }
        public Nullable<System.Guid> ParentID { get; set; }
        public Nullable<byte> Sort { get; set; }
    }
}