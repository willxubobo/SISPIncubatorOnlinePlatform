using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class UserRequest : SearchRequest
    {        
        public string Mobile { get; set; }
        public string KeyWord { get; set; }
        public string ApproveList { get; set; }
        public string Status { get; set; }
    }

    public class UserCreateRequest
    {
        public User User { get; set; }
        public string Code { get; set; }
        public string WeiXinCode { get; set; }
        public string PageUrl { get; set; }
        public WeChat WeChat { get; set; }
        public WeiXinRequest WeiXinRequest { get; set; }
        public string RegSource { get; set; }
        public string LogoUrl { get; set; }
        public string RoleID { get; set; }
        public string ApproveStatus { get; set; }
        public UserExtension UserExtension { get; set; }
        public string AddType { get; set; }
    }

    public class UserUpdateRequest
    {
        public User User { get; set; }

        public string PropertyName { get; set; }

        public string OldPwd { get; set; }

        public string OperatorType { get; set; }
    }

    public class UploadFileRequest
    {
        public UploadFileRequest(string SavePath)
        {
            this.SavePath = SavePath;
        }
        public string SImgUrl { get; set; }
        public string ImgName { get; set; }
        public string Xy { get; set; }
        public string SavePath { get; set; }
    }
}