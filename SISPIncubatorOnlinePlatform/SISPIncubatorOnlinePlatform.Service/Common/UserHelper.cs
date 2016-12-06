using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Common
{
    public class UserHelper
    {
        public static User CurrentUser
        {
            get
            {
                if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null && !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
                {
                    string userPhone = HttpContext.Current.User.Identity.Name;
                    return new UserManager().GetUserByMobile(userPhone);                   
                }
                throw new UnauthorizedAccessException("用户尚未登录！");
            }
        }

        public static User CurrentUserData
        {
            get
            {
                if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null &&
                    !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
                {
                    string userPhone = HttpContext.Current.User.Identity.Name;
                    return new UserManager().GetUserByMobile(userPhone);
                }
                else
                {
                    return null;
                }
            }
        }
    }
}