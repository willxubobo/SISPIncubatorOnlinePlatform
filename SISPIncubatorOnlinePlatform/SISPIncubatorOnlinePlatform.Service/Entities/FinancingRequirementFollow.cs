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
    
    public partial class FinancingRequirementFollow
    {
        public System.Guid FollowID { get; set; }
        public System.Guid FRID { get; set; }
        public string FollowType { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
    
        public virtual User User { get; set; }
    }
}
