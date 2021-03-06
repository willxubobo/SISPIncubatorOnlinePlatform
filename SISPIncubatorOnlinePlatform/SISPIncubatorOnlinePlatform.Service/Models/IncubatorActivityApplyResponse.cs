﻿using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class IncubatorActivityApplyResponse : BusinessResponse<IncubatorActivityApplyDTO>
    {
        [DataMember]
        public System.Guid Id { get; set; }
    }
}