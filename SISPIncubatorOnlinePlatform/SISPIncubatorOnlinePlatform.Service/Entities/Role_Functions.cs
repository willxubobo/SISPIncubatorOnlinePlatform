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
    
    public partial class Role_Functions
    {
        public System.Guid ID { get; set; }
        public System.Guid RoleID { get; set; }
        public System.Guid FunctionID { get; set; }
    
        public virtual Functions Functions { get; set; }
        public virtual Roles Roles { get; set; }
    }
}
