using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class UserDTO
    {
        public System.Guid UserID { get; set; }
        public string Mobile { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; }
        public string Avatar { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string WeChat { get; set; }
        public int LoginTimes { get; set; }
        public System.DateTime LastLogin { get; set; }
        public bool Status { get; set; }
        public System.DateTime Created { get; set; }
    }
}