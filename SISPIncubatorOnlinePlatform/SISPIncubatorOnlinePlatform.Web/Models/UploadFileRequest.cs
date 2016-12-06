using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Models
{
    public class UploadFileRequest
    {
        public UploadFileRequest(string SavePath)
        {
            this.SavePath = SavePath;
        }
       
        public string SavePath { get; set; }
    }
}