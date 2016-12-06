using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class IncubatorRequest : SearchRequest
    {
        public string KeyWord { get; set; }
        ///判断是管理员还是普通用户
        public string UserType { get; set; }
    }


    public class IncubatorInfoRequest
    {
        public IncubatorInformation IncubatorInformation { get; set; }
        public WeiXinRequest WeiXinRequest { get; set; }

        public virtual ICollection<IncubatorProjectsDTO> IncubatorProjectsDtos { get; set; }
    }

    /// <summary>
    /// 更新孵化器的状态
    /// </summary>
    public class IncubatorInfoDeleteRequest
    {
        public string Ids { get; set; }
    }
}