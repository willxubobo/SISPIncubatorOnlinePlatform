using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class MessageChartDTO
    {
        public System.Guid MessageID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public System.Guid SendFrom { get; set; }
        public System.Guid SendTo { get; set; }
        public string Status { get; set; }
        public string Created { get; set; }
        public string Headimgurl { get; set; }

        public bool DeleteFlagS { get; set; }
        public bool DeleteFlagR { get; set; }

        public string SendFromUserName { get; set; }
        public string SendToUserName { get; set; }
    }
}