﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ExportResponse
    {
        [DataMember]
        public string FileUrl { get; set; }
    }
}