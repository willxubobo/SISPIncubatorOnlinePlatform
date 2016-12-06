using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class BlockedIpManager:BaseManager
    {
        /// <summary>
        /// 新增一个黑名单Ip
        /// </summary>
        public void Add(BlockedIP blockedIp)
        {
            BlockedIP blockedIpOld =
                SISPIncubatorOnlinePlatformEntitiesInstance.BlockedIP.FirstOrDefault(p => p.ID == blockedIp.ID);
            if (blockedIpOld == null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.BlockedIP.Add(blockedIp);
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        public List<BlockedIP> GetAll()
        {
            return SISPIncubatorOnlinePlatformEntitiesInstance.BlockedIP.ToList();
        }
    }
}