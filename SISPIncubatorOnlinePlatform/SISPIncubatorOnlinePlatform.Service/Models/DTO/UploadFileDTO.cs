using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class UploadFileDTO
    {
        [DataMember]
        public string SImgUrl { get; set; }
        [DataMember]
        public string HeadImgUrl { get; set; }
        [DataMember]
        public string Xy { get; set; }
        [DataMember]
        public string Radio { get; set; }
        [DataMember]
        public string SavePath { get; set; }
    }
}