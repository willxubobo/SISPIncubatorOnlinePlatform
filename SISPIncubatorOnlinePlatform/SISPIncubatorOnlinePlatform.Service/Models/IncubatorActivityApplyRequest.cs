using SISPIncubatorOnlinePlatform.Service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class IncubatorActivityApplyRequest : SearchRequest
    {

    }
    public class IncubatorActivityApplyCreateRequest
    {
        public bool IsAdmin { get; set; }
        public IncubatorCreateActivityApplyDTO IncubatorActivityApply { get; set; }
    }
    public class IncubatorActivityApplyUpdateRequest
    {
        public bool IsAdmin { get; set; }
        public IncubatorActivityApplyDTO IncubatorActivityApply { get; set; }
    }
}