using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivityImagesDTO
    {
        public System.Guid ActivityID { get; set; }
        public string FileName { get; set; }
    }
    public class ActivityImagesResponseDTO
    {
        public System.Guid ImgID { get; set; }
        public System.Guid ActivityID { get; set; }
        public string ImgSrc { get; set; }
        public int Sort { get; set; }
        public string MThumb { get; set; }

        public string SThumb { get; set; }
    }
}