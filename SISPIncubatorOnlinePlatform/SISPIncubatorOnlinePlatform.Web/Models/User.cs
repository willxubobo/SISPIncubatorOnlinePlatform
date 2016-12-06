using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Models 
{
    public class User
    {
        public string UserName { get; set; }
        public string Mobile { get; set; }
        public string UserType { get; set; }
        public string Avatar { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string WeChat { get; set; }
        public Guid UserID { get; set; }

        public User ConvertUser(AuthToken authToken)
        {
            if (authToken == null)
            {
                return null;
            }

            User user = new User();
            user.UserName = authToken.User_Name;
            user.Email = authToken.User_Email;
            user.Address = authToken.User_Address;
            if (!authToken.User_Avatar.Contains("http"))
            {
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["ServiceImgUrl"]))
                {
                    if (ConfigurationManager.AppSettings["ServiceImgUrl"].EndsWith("/"))
                    {
                        user.Avatar = ConfigurationManager.AppSettings["ServiceImgUrl"] + authToken.User_Avatar;
                    }
                    else
                    {
                        user.Avatar = ConfigurationManager.AppSettings["ServiceImgUrl"] + "/" + authToken.User_Avatar;
                    }
                }
            }
            else
            {

                user.Avatar = authToken.User_Avatar;
            }
            user.Mobile = authToken.User_Mobile;
            user.WeChat = authToken.User_Wechat;
            user.UserType = authToken.User_Type;
            user.UserID = authToken.User_ID;

            return user;
        }
    }
}