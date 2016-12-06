using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IWeiXin
    {
        IHttpActionResult GetUserInfo(WeiXinRequest weiXinRequest);
        IHttpActionResult GetMultimedia(WeiXinRequest weiXinRequest);

    }
}
