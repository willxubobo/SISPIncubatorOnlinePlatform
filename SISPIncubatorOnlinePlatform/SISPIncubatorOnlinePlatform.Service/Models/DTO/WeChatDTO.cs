using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class WeChatDTO
    {
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
        public string RedirectUrl { get; set; }
        public string OpenID { get; set; }
    }
}