using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class IncubatorProjectReportDTO
    {
        public System.Guid IncubatorID { get; set; }
        public string IncubatorName { get; set; }
        public string IncubatorDes { get; set; }
        public int ProjectRegisteredCount { get; set; }
        public int ProjectHatchingCount { get; set; }
        public int ProjectIncubatoredCount { get; set; }
        public int ProjectSeekFinancingCount { get; set; }
    }
}