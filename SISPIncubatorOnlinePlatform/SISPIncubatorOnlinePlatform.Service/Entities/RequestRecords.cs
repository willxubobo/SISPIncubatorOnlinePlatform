//------------------------------------------------------------------------------
// <auto-generated>
//    此代码是根据模板生成的。
//
//    手动更改此文件可能会导致应用程序中发生异常行为。
//    如果重新生成代码，则将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace SISPIncubatorOnlinePlatform.Service.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class RequestRecords
    {
        public long ID { get; set; }
        public string User { get; set; }
        public string ClientType { get; set; }
        public string UserAgent { get; set; }
        public string UserHostAddress { get; set; }
        public string RequestUri { get; set; }
        public string HttpMethod { get; set; }
        public System.DateTime RequestTime { get; set; }
    }
}
