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
    
    public partial class IncubatorActivityApply
    {
        public System.Guid ActivityID { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Topic { get; set; }
        public string Sponsor { get; set; }
        public string Co_sponsor { get; set; }
        public int Participants { get; set; }
        public string Industry { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public string TimeBucket { get; set; }
        public string Remark { get; set; }
        public string ActivityDescription { get; set; }
        public string DemandForSpace { get; set; }
        public string DemandForStall { get; set; }
        public string FreeItem { get; set; }
        public string ChargeItem { get; set; }
        public string Status { get; set; }
        public string Origin { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
    
        public virtual User User { get; set; }
    }
}
