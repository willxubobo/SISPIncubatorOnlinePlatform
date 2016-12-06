using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SD = System.Drawing;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class UserController : BaseController, IUser
    {
        readonly UserManager _userManager = new UserManager();

        [HttpPost]
        [Route("user")]
        public IHttpActionResult CreateUser(Models.UserCreateRequest userCreateRequest)
        {
            string userid=_userManager.CreateUser(userCreateRequest);
            return Ok(userid);
        }

        [HttpPatch]
        [Route("user")]
        public IHttpActionResult UpdateUser(UserUpdateRequest userUpdateRequest)
        {
            _userManager.UpdateUser(userUpdateRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("users")]
        public IHttpActionResult GetUsers(UserRequest conditions)
        {
            int TotalRecords;
            UserResponse userResponse = new UserResponse();
            List<UserDTO> list = _userManager.GetAll(conditions,out TotalRecords);
            userResponse.Results = list;
            userResponse.TotalCount = TotalRecords;
            return Ok(userResponse);
        }

        [Authorize]
        [HttpPut]
        [Route("user")]
        public IHttpActionResult UpdateUser(UserCreateRequest userCreateRequest)
        {
            _userManager.UpdateUser(userCreateRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("user/approve")]
        public IHttpActionResult ApproveUser(UserCreateRequest userCreateRequest)
        {
            _userManager.ApproveUser(userCreateRequest);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        [Route("user/logo")]
        public IHttpActionResult UpdateUserLogo(UserCreateRequest userCreateRequest)
        {
            _userManager.UpdateUserLogo(userCreateRequest);
            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("user/{mobile}")]
        public IHttpActionResult GetUser(string mobile)
        {
            User user = _userManager.GetUserByMobile(mobile);

            Dictionary<string, string> userProperties = null;
            if (user != null)
            {
                var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                string headurl = string.Empty;
                if (user.WeChat.Count > 0)
                {
                    //modify by kimble
                    //WeChat weChat = user.WeChat.First<WeChat>();
                    WeChat weChat = user.WeChat.FirstOrDefault();
                    headurl = weChat.Headimgurl;
                    if (!weChat.Headimgurl.Contains("http"))
                    {
                        headurl = serviceUrl + weChat.Headimgurl;
                    }
                }
                else
                {
                    headurl = serviceUrl + "default_pic.jpg";
                }
                string userroles = string.Empty;
                if (user.User_Roles.Count > 0)
                {
                    List<User_Roles> ulist = user.User_Roles.ToList();
                    foreach (User_Roles userRoles in ulist)
                    {
                        userroles += userRoles.RoleID.ToString() + ",";
                    }
                }
                string ComName = string.Empty;
                string LinenseImg = string.Empty;
                string CardImg = string.Empty;
                string ComDesc = string.Empty;
                if (user.UserType.Trim() == "企业")
                {
                    UserExtension userExtension = _userManager.GetUserExtensionByID(user.UserID);
                    if (userExtension != null)
                    {
                        ComName = userExtension.CompanyName;
                        LinenseImg = serviceUrl + userExtension.BusinessLicenseImg;
                        CardImg = serviceUrl + userExtension.IDCardImg;
                        ComDesc = userExtension.Description;
                    }
                }
                userProperties = new Dictionary<string, string>
                {
                    {
                      "user_name", user.UserName
                    },
                    {
                      "user_mobile", user.Mobile
                    },
                    {
                      "user_type", user.UserType
                    },
                    {
                      "user_avatar",  headurl
                    },
                    {
                      "user_email", user.Email
                    },
                    {
                      "user_address", user.Address
                    },
                    {
                      "user_id", user.UserID.ToString()
                    },
                    {
                        "user_roles",userroles
                    },
                    {
                      "user_comname", ComName
                    },
                    {
                      "user_linenseimg", LinenseImg
                    },
                    {
                      "user_cardimg", CardImg
                    },
                    {
                        "user_desc",ComDesc
                    },
                    {
                        "user_status",user.Status.ToString()
                    }
                };
            }

            return Ok(userProperties);
        }

        [Authorize]
        [HttpGet]
        [Route("user/pending/{UserID:Guid}")]
        public IHttpActionResult GetUser(Guid UserID)
        {
            User user = _userManager.GetComUserById(UserID);

            Dictionary<string, string> userProperties = null;
            if (user != null)
            {
                var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                string headurl = string.Empty;
                if (user.WeChat.Count > 0)
                {
                    //modify by kimble

                    //WeChat weChat = user.WeChat.First<WeChat>();
                    WeChat weChat = user.WeChat.FirstOrDefault();
                    headurl = weChat.Headimgurl;
                    if (!weChat.Headimgurl.Contains("http"))
                    {
                        headurl = serviceUrl + weChat.Headimgurl;
                    }
                }
                else
                {
                    headurl = serviceUrl + "default_pic.jpg";
                }
                string userroles = string.Empty;
                if (user.User_Roles.Count > 0)
                {
                    List<User_Roles> ulist = user.User_Roles.ToList();
                    foreach (User_Roles userRoles in ulist)
                    {
                        userroles += userRoles.RoleID.ToString() + ",";
                    }
                }
                string ComName = string.Empty;
                string LinenseImg = string.Empty;
                string CardImg = string.Empty;
                string ComDesc = string.Empty;
                if (user.UserType.Trim() == "企业")
                {
                    UserExtension userExtension = _userManager.GetUserExtensionByID(user.UserID);
                    if (userExtension != null)
                    {
                        ComName = userExtension.CompanyName;
                        LinenseImg = serviceUrl + userExtension.BusinessLicenseImg;
                        CardImg = serviceUrl + userExtension.IDCardImg;
                        ComDesc = userExtension.Description;
                    }
                }
                userProperties = new Dictionary<string, string>
                {
                    {
                      "user_name", user.UserName
                    },
                    {
                      "user_mobile", user.Mobile
                    },
                    {
                      "user_type", user.UserType
                    },
                    {
                      "user_avatar",  headurl
                    },
                    {
                      "user_email", user.Email
                    },
                    {
                      "user_address", user.Address
                    },
                    {
                      "user_id", user.UserID.ToString()
                    },
                    {
                        "user_roles",userroles
                    },
                    {
                      "user_comname", ComName
                    },
                    {
                      "user_linenseimg", LinenseImg
                    },
                    {
                      "user_cardimg", CardImg
                    },
                    {
                        "user_desc",ComDesc
                    },
                    {
                        "user_status",user.Status.ToString()
                    }
                };
            }

            return Ok(userProperties);
        }

        [Authorize]
        [HttpPost]
        [Route("user/search")]
        public IHttpActionResult GetUser(UserRequest conditions)
        {
            UserResponse userResponse = new UserResponse();
            UserManager userManager = new UserManager();
            User user = userManager.GetUserByMobile(conditions.Mobile);
            List<User> list = new List<User>();
            list.Add(user);
            List<UserDTO> dtoList = new List<UserDTO>();
            Utility.CopyList<User, UserDTO>(list, dtoList);
            userResponse.Results = dtoList;

            userResponse.TotalCount = list.Count;
            return Ok(userResponse);
        }

        [HttpPost]
        [Route("user/check")]
        public IHttpActionResult CheckUser(UserRequest conditions)
        {
            UserManager userManager = new UserManager();
            User user = userManager.CheckUser(conditions.Mobile);
            if (user != null)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [Authorize]
        [HttpGet]
        [Route("user/role/{Id}")]
        public IHttpActionResult GetUserRole(Guid id)
        {
            UserManager userManager = new UserManager();
            var result = userManager.GetUserRole(id);
            return Ok(result);
        }

        [HttpPost]
        [Route("user/file")]
        public IHttpActionResult UploadFile()
        {
            string spath=System.Web.HttpContext.Current.Request.Params["SavePath"];
            string fextension = System.Web.HttpContext.Current.Request.Params["FileExtension"];//允许上传的后缀名
            string UserLogoSize = System.Web.HttpContext.Current.Request.Params["LogoSize"];//初始选取框大小
            string UserLogoRadio = System.Web.HttpContext.Current.Request.Params["LogoRadio"];//初始选取框比例
            if (string.IsNullOrEmpty(spath))
            {
                throw new BadRequestException("未获取到图片保存路径！");
            }
            if (string.IsNullOrEmpty(fextension))
            {
                throw new BadRequestException("未获取到允许上传的文件后缀！");
            }
            UploadFileDTO userResponse = new UploadFileDTO();
            //string result = string.Empty;
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string imgPath = "";
            if (hfc.Count > 0)
            {
                fextension = ConfigurationManager.AppSettings[fextension];
                String FileExtension = Path.GetExtension(hfc[0].FileName).ToLower();
                String[] allowedExtensions = fextension.Split('|');
                bool FileOK = false;
                for (int i = 0; i < allowedExtensions.Length; i++)
                {
                    if (FileExtension == allowedExtensions[i])
                    {
                        FileOK = true;
                        break;
                    }
                }
                if (FileOK)
                {
                    UserLogoSize = ConfigurationManager.AppSettings[UserLogoSize];
                    if (!string.IsNullOrEmpty(UserLogoRadio))
                    {
                        UserLogoRadio = ConfigurationManager.AppSettings[UserLogoRadio];
                    }
                    else
                    {
                        UserLogoRadio = "1";//未配置比例，默认为１
                    }
                    var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                    string fileUploadFolder = ConfigurationManager.AppSettings[spath];
                    string PhysicalPath = HttpContext.Current.Server.MapPath("../" + fileUploadFolder);
                    if (!Directory.Exists(PhysicalPath))
                    {
                        Directory.CreateDirectory(PhysicalPath);
                    }
                    string fname = Guid.NewGuid().ToString() + FileExtension;
                    imgPath = fileUploadFolder + "/" + fname;
                    string savepath = PhysicalPath + "/" + fname;
                    hfc[0].SaveAs(savepath);
                    userResponse.HeadImgUrl = imgPath;
                    userResponse.SImgUrl = serviceUrl;
                    userResponse.Xy = UserLogoSize;
                    userResponse.Radio = UserLogoRadio;
                }
                else
                {
                    userResponse.HeadImgUrl = "error";
                }
            }
            return Ok(userResponse);
        }

        [HttpPost]
        [Route("user/cropfile")]
        public IHttpActionResult CropUploadFile(UploadFileRequest uploadFileDto)
        {
            if (string.IsNullOrEmpty(uploadFileDto.ImgName) || string.IsNullOrEmpty(uploadFileDto.Xy))
            {
                throw new BadRequestException("图片剪切失败！");
            }
            uploadFileDto.ImgName = uploadFileDto.ImgName.Replace("/", "");
            UploadFileDTO userResponse = new UploadFileDTO();
            UserManager userManager = new UserManager();
            string[] xy = uploadFileDto.Xy.TrimEnd(',').Split(',');
            int w = Convert.ToInt32(xy[0]);
            int h = Convert.ToInt32(xy[1]);
            int x = Convert.ToInt32(xy[2]);
            int y = Convert.ToInt32(xy[3]);
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            string fileFolder = ConfigurationManager.AppSettings[uploadFileDto.SavePath];
            string PhyPath = HttpContext.Current.Server.MapPath("../" + fileFolder);
            string path = PhyPath+"/" + uploadFileDto.ImgName;
            byte[] CropImage = userManager.Crop(path, w, h, x, y);
            using (MemoryStream ms = new MemoryStream(CropImage, 0, CropImage.Length))
            {
                ms.Write(CropImage, 0, CropImage.Length);
                using (SD.Image CroppedImage = SD.Image.FromStream(ms, true))
                {
                    string SaveTo = PhyPath + "/crop" + uploadFileDto.ImgName;
                    CroppedImage.Save(SaveTo, CroppedImage.RawFormat);
                    userResponse.HeadImgUrl = fileFolder + "/crop" + uploadFileDto.ImgName;
                    userResponse.SImgUrl = serviceUrl;
                    if (File.Exists(path))//剪切后删除原图
                    {
                        File.Delete(path);
                    }
                }
            }

            return Ok(userResponse);
        }

        [Authorize]
        [HttpDelete]
        [Route("user/{UserID:Guid}")]
        public IHttpActionResult DeleteUser(Guid UserID)
        {
            UserManager userManager = new UserManager();
            userManager.DeleteUser(UserID);
            return Ok();
        }

        [HttpPost]
        [Route("user/comfile")]
        public IHttpActionResult CreateCompanyAttachment()
        {
            UserManager userManager = new UserManager();
            userManager.AddCompanyAttachment();
            UploadFileDTO userResponse = new UploadFileDTO();

            userResponse.HeadImgUrl = "error";
            return Ok(userResponse);
        }

        [Authorize]
        [HttpPost]
        [Route("user/{UserID:Guid}")]
        public IHttpActionResult ResetUserPwd(Guid UserID)
        {
            UserManager userManager = new UserManager();
            userManager.ResetUserPwd(UserID);
            return Ok();
        }
    }
}
