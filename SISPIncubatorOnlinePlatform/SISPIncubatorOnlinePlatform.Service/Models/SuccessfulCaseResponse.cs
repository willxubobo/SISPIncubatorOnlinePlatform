﻿using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class SuccessfulCaseResponse : BusinessResponse<SuccessfulCaseDTO>
    {
        public System.Guid CaseID { get; set; }
    }
}