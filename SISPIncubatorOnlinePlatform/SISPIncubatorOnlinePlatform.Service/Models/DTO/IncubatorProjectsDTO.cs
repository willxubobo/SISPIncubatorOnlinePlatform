using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class IncubatorProjectsDTO
    {
        public System.Guid ProjectID { get; set; }
        public System.Guid IncubatorID { get; set; }
        public string ProjectType { get; set; }

        public string ProjectTypeDes { get; set; }
        public string ProjectPicture { get; set; }
        public string Description { get; set; }

        public string MediaID { get; set; }
        public string FileName { get; set; }
        public string SavePath { get; set; }
    }
}