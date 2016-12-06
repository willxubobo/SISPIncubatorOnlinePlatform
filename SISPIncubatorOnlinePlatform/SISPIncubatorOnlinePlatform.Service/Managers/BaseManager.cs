using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class BaseManager
    {
        private SISPIncubatorOnlinePlatformEntities entitys;

        public SISPIncubatorOnlinePlatformEntities SISPIncubatorOnlinePlatformEntitiesInstance
        {
            get
            {
                if (entitys == null)
                    entitys = new SISPIncubatorOnlinePlatformEntities();

                return entitys;
            }
        }
    }
}