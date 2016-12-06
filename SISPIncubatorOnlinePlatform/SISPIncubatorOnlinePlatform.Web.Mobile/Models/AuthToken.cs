using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Mobile.Models
{
    public class AuthToken
    {
        public string Access_Token { get; set; }
        public string Token_Type { get; set; }
        public int Expires_In { get; set; }        
        public DateTime Issued { get; set; }
        public DateTime Expires { get; set; } 
        public string User_Name { get; set; }
        public string User_Mobile { get; set; }
        public string User_Type { get; set; }
        public string User_Avatar { get; set; }
        public string User_Email { get; set; }
        public string User_Wechat { get; set; }
        public string User_Address { get; set; }
        public Guid User_ID { get; set; }   
    }
}