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
    
    public partial class WeChat
    {
        public System.Guid WeChatID { get; set; }
        public System.Guid UserID { get; set; }
        public string Country { get; set; }
        public string Province { get; set; }
        public string City { get; set; }
        public string Sex { get; set; }
        public string Nickname { get; set; }
        public string Language { get; set; }
        public string Headimgurl { get; set; }
        public Nullable<bool> Subscribe { get; set; }
        public byte[] SubscribeTime { get; set; }
        public string Remark { get; set; }
        public string GroupID { get; set; }
        public string OpenID { get; set; }
    
        public virtual User User { get; set; }
    }
}