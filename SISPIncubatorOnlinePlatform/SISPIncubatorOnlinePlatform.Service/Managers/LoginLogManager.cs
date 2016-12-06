using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class LoginLogManager : BaseManager
    {
        public void Add(LoginLog loginLog)
        {
            if (loginLog != null && loginLog.LoginIP != "::1")
            {
                User user = UserHelper.CurrentUser;
                loginLog.LogID = Guid.NewGuid();
                loginLog.LoginTime = DateTime.Now;
                loginLog.UserID = user.UserID;

                SISPIncubatorOnlinePlatformEntitiesInstance.LoginLog.Add(loginLog);

                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
        }
    }
}