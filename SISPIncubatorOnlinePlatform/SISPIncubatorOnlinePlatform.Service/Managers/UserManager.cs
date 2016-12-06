using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SD = System.Drawing;


namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class UserManager : BaseManager
    {
        /// <summary>
        /// 创建用户信息
        /// </summary>
        /// <param name="userCreateRequest"></param>
        /// <returns></returns>
        public string CreateUser(UserCreateRequest userCreateRequest)
        {
            Guid uid = Guid.NewGuid();
            User user = userCreateRequest.User;
            if (user != null)
            {
                User modelUser =
                    SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(u => u.Mobile == user.Mobile && u.Status == true);
                if (modelUser == null)
                {
                    UserExtension userExtension = userCreateRequest.UserExtension;
                    User loginuser = UserHelper.CurrentUserData;
                    SMSValidateCodeManager smsValidateCodeManager = new SMSValidateCodeManager();
                    bool checkcode = true;
                    if (loginuser == null)//注册时需验证手机验证码
                    {
                        checkcode = smsValidateCodeManager.CheckValidateCode(userCreateRequest.Code, user.Mobile);
                    }
                    if (checkcode) //check 验证码
                    {
                        string AddType = userCreateRequest.AddType;
                        if (user.UserType.Trim() == "个人")
                        {
                            user.Status = true;
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(AddType) && AddType == "manager")
                            {
                                user.Status = true;
                            }
                            else
                            {
                                user.Status = false;
                            }
                            if (userExtension != null)
                            {
                                userExtension.UserID = uid;
                                WeiXinRequest weiXinRequest = userCreateRequest.WeiXinRequest;
                                if (weiXinRequest != null)
                                {
                                    WeiXinManager weiXinManager = new WeiXinManager();
                                    weiXinManager.GetMultimedia(weiXinRequest);
                                }
                                string fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                                string[] flist = weiXinRequest.FileName.Split(',');
                                userExtension.BusinessLicenseImg = fileUploadFolder + "\\" + flist[0] + ".jpg";
                                userExtension.IDCardImg = fileUploadFolder + "\\" + flist[1] + ".jpg";
                            }
                        }
                        user.UserID = uid;
                        user.Created = DateTime.Now;
                        if (loginuser == null) //注册时是填写的密码
                        {
                            user.Password = Utility.GetMD5_32(user.Password);
                        }
                        else
                        {
                            string initpwd = ConfigurationManager.AppSettings["InitPwd"];
                            user.Password = Utility.GetMD5_32(initpwd);
                            user.Status = true;
                        }
                        SISPIncubatorOnlinePlatformEntitiesInstance.User.Add(user);
                        if (user.UserType.Trim() == "企业" && userExtension != null)
                        {
                            SISPIncubatorOnlinePlatformEntitiesInstance.UserExtension.Add(userExtension);
                        }
                        SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                        if (!string.IsNullOrEmpty(userCreateRequest.RegSource) && userCreateRequest.RegSource == "mobile")
                        {
                            if (userCreateRequest.WeChat != null && !string.IsNullOrEmpty(userCreateRequest.WeChat.Headimgurl))
                            {
                                bool isadd = true;
                                //保存用户信息后保存微信信息
                                WeChat weChat = userCreateRequest.WeChat;
                                if (!string.IsNullOrEmpty(weChat.OpenID))
                                {
                                    WeChat weChatDb =
                                        SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.FirstOrDefault(
                                            d => d.OpenID == weChat.OpenID);
                                    if (weChatDb != null)//已经存在时更新
                                    {
                                        isadd = false;
                                        weChatDb.UserID = user.UserID;
                                        weChatDb.Headimgurl =
                                    HttpContext.Current.Server.UrlDecode(weChat.Headimgurl)
                                        .Replace("\\", "/")
                                        .Replace("//", "/");
                                        weChatDb.Nickname = weChat.Nickname;
                                    }
                                }
                                if (isadd)
                                {
                                    weChat.UserID = user.UserID;
                                    weChat.WeChatID = Guid.NewGuid();
                                    weChat.Headimgurl =
                                        HttpContext.Current.Server.UrlDecode(weChat.Headimgurl)
                                            .Replace("\\", "/")
                                            .Replace("//", "/");
                                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Add(weChat);
                                }
                            }
                            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                            //else
                            //{
                            //    throw new BadRequestException("[UserManager Method(CreateUser): ]未获取到用户微信信息！");
                            //}
                        }
                        //保存用户角色
                        if (!string.IsNullOrEmpty(userCreateRequest.RoleID))
                        {
                            CreateUserRoles(userCreateRequest.RoleID, user.UserID);
                        }
                    }
                    else
                    {
                        throw new BadRequestException("[UserManager Method(CreateUser): 验证码验证失败]验证码不正确！");
                    }
                }
                else
                {
                    throw new ConflictException("[UserManager Method(CreateUser): 此手机号已注册过！Mobile: " + user.Mobile + "]此手机号已注册过！");
                }
            }
            else
            {
                throw new BadRequestException("[UserManager Method(CreateUser): userCreateRequest is null]未获取到要创建的用户信息！");
            }
            return uid.ToString();
        }

        /// <summary>
        /// 创建用户角色
        /// </summary>
        /// <returns></returns>
        public void CreateUserRoles(string RoleID, Guid UserID)
        {
            //先删除已经添加的项
            List<User_Roles> list =
                SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles.Where(d => d.UserID == UserID).ToList();
            SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles.RemoveRange(list);

            string[] fids = RoleID.TrimEnd(',').Split(',');
            foreach (string fid in fids)
            {
                User_Roles userRoles = new User_Roles();
                userRoles.ID = Guid.NewGuid();
                userRoles.UserID = UserID;
                userRoles.RoleID = Guid.Parse(fid);
                SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles.Add(userRoles);
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }
        /// <summary>
        /// 根据手机号获取用户信息
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public User GetUserByMobile(string mobile)
        {
            if (string.IsNullOrEmpty(mobile))
            {
                throw new BadRequestException("[UserManager Method(GetUserByMobile): 该手机号码不存在！ Mobile：" + mobile + "]该手机号码不存在！");
            }
            else
            {
                return SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(u => u.Mobile == mobile && u.Status == true);
            }
        }

        /// <summary>
        /// 根据user获取企业注册信息
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public UserExtension GetUserExtensionByID(Guid UserID)
        {
            return SISPIncubatorOnlinePlatformEntitiesInstance.UserExtension.FirstOrDefault(u => u.UserID == UserID);
        }

        /// <summary>
        /// 根据id获取待审核企业用户信息
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public User GetComUserById(Guid id)
        {
            if (string.IsNullOrEmpty(Convert.ToString(id)))
            {
                throw new BadRequestException("[UserManager Method(GetComUserById): ]未获取到用户编号！");
            }
            else
            {
                User user = SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(u => u.UserID == id);
                return user;
            }
        }

        /// <summary>
        /// 根据id获取用户信息
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public User GetUserById(Guid id)
        {
            if (string.IsNullOrEmpty(Convert.ToString(id)))
            {
                return null;
            }
            else
            {
                User user = SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(u => u.UserID == id && u.Status == true);
                return user;
            }
        }

        public User CheckUser(string mobile)
        {
            if (string.IsNullOrEmpty(mobile))
            {
                return null;
            }
            else
            {
                User user =
                    SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(
                        u => u.Mobile == mobile && u.Status == true);
                return user;
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void DeleteUser(Guid UserID)
        {
            User model = SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(m => m.UserID == UserID && m.Status == true);
            if (model != null)
            {
                model.Status = false;
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[UserManager Method(DeleteUser): 删除提交出错id=" + UserID + "]删除提交失败！");
                }
            }
            else
            {
                throw new BadRequestException("[UserManager Method(DeleteUser): UserID is null,id=" + UserID + "]未获取到要删除的数据！");
            }
        }

        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void ResetUserPwd(Guid UserID)
        {
            User model = SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(m => m.UserID == UserID && m.Status == true);
            if (model != null)
            {
                string initpwd = ConfigurationManager.AppSettings["InitPwd"];
                model.Password = Utility.GetMD5_32(initpwd);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[UserManager Method(ResetUserPwd): UserID is null,id=" + UserID + "]未获取到用户数据！");
            }
        }

        public void UpdateUser(UserUpdateRequest userUpdateRequest)
        {
            if (userUpdateRequest != null)
            {

                string oType = userUpdateRequest.OperatorType;
                string oldpwd = userUpdateRequest.OldPwd;
                if (!string.IsNullOrEmpty(oType) && oType == "mp")
                {
                    User user = UserHelper.CurrentUser;
                    if (user.Password != Utility.GetMD5_32(oldpwd))
                    {
                        throw new BadRequestException(
                            "[UsersManager Method(void UpdateUser): user.Password != Utility.GetMD5_32(oldpwd)]原始密码不正确！");
                    }
                    else
                    {
                        User userNew = SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(p => p.Mobile == user.Mobile);
                        if (userNew != null)
                        {
                            userNew.Password = Utility.GetMD5_32(userUpdateRequest.User.Password);
                        }
                        else
                        {
                            throw new BadRequestException("[UsersManager Method(void UpdateUser): userNew is null]未获取到用户信息！");
                        }
                    }
                }
                else
                {
                    User userNew = GetUserByMobile(userUpdateRequest.User.Mobile);
                    DbEntityEntry entryEntity = SISPIncubatorOnlinePlatformEntitiesInstance.Entry<User>(userNew);
                    DbEntityEntry entryDto =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Entry<User>(userUpdateRequest.User);
                    entryEntity.Property(userUpdateRequest.PropertyName).CurrentValue =
                        Utility.GetMD5_32(entryDto.Property(userUpdateRequest.PropertyName).CurrentValue.ToString());
                }


                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[UsersManager Method(void UpdateUser): UserUpdateRequest is null]未获取到用户信息！");
            }
        }

        public void UpdateLastLoginData(string mobile)
        {
            if (string.IsNullOrEmpty(mobile))
            {
                return;
            }

            User user = GetUserByMobile(mobile);
            if (user == null)
            {
                return;
            }

            user.LastLogin = DateTime.Now;
            user.LoginTimes = user.LoginTimes == null ? 1 : user.LoginTimes + 1;

            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        /// <summary>
        /// 根据查询条件获取所有用户信息
        /// </summary>
        /// <returns></returns>
        public List<UserDTO> GetAll(UserRequest conditions, out int TotalRecords)
        {
            TotalRecords = 0;
            List<User> list = new List<User>();
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
            if (!string.IsNullOrEmpty(conditions.ApproveList) && conditions.ApproveList == "true")
            {
                List<SqlParameter> paralist = new List<SqlParameter>();
                string sql = "select * from [user] where userid in (select userid from UserExtension where isapproval=0) and status=0 ";
                if (!string.IsNullOrEmpty(conditions.KeyWord))
                {
                    sql += " and (UserName like @KeyWord or Phone like @KeyWord or Mobile like @KeyWord or Email like @KeyWord)";
                    paralist.Add(new SqlParameter("@KeyWord", "%" + conditions.KeyWord.Trim() + "%"));
                }
                sql += " order by created desc";
                List<User> userList = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<User>(sql,
                                            paralist.ToArray()).ToList();
                TotalRecords = userList.Count;
                list = userList.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<User>();
            }
            else if (!string.IsNullOrEmpty(conditions.ApproveList) && conditions.ApproveList == "managerall")
            {
                List<SqlParameter> paralist = new List<SqlParameter>();
                string sql = "select * from [user] where 1=1 ";
                if (!string.IsNullOrEmpty(conditions.KeyWord))
                {
                    sql += " and (UserName like @KeyWord or Phone like @KeyWord or Mobile like @KeyWord or Email like @KeyWord)";
                    paralist.Add(new SqlParameter("@KeyWord", "%" + conditions.KeyWord.Trim() + "%"));
                }
                if (!string.IsNullOrEmpty(conditions.Status) && conditions.Status != "-1")
                {
                    sql += " and Status=@Status";
                    paralist.Add(new SqlParameter("@Status", conditions.Status));
                }
                sql += " order by created desc";
                List<User> userList = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<User>(sql,
                                            paralist.ToArray()).ToList();
                TotalRecords = userList.Count;
                list = userList.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<User>();
            }
            else if (conditions != null && !string.IsNullOrEmpty(conditions.KeyWord))
            {
                List<User> userList =
                    SISPIncubatorOnlinePlatformEntitiesInstance.User.Where(
                        p =>
                            (p.Phone.Contains(conditions.KeyWord) || p.Email.Contains(conditions.KeyWord) ||
                             p.Mobile.Contains(conditions.KeyWord) || p.UserName.Contains(conditions.KeyWord)) &&
                            p.Status == true).ToList();
                TotalRecords = userList.Count;
                list = userList.OrderByDescending(p => p.Created).Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<User>();
            }
            else if (!string.IsNullOrEmpty(conditions.ApproveList) && conditions.ApproveList == "selectinvestor")//添加投资人选择用户
            {
                List<SqlParameter> paralist = new List<SqlParameter>();
                string sql = "select * from [User] where UserID not in (select userid from InvestorInformation) and status=1";
                if (!string.IsNullOrEmpty(conditions.KeyWord))
                {
                    sql += " and (UserName like @KeyWord or Phone like @KeyWord or Mobile like @KeyWord or Email like @KeyWord)";
                    paralist.Add(new SqlParameter("@KeyWord", "%" + conditions.KeyWord.Trim() + "%"));
                }
                sql += " order by created desc";
                List<User> userList = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<User>(sql,
                            paralist.ToArray()).ToList();
                TotalRecords = userList.Count;
                list = userList.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<User>();
            }
            else
            {
                List<User> userList =
                    SISPIncubatorOnlinePlatformEntitiesInstance.User.Where(p => p.Status == true)
                        .ToList<User>();
                TotalRecords = userList.Count;
                list = userList.OrderByDescending(p => p.Created).Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList<User>();
            }
            List<UserDTO> dtoList = new List<UserDTO>();
            Utility.CopyList<User, UserDTO>(list, dtoList);
            return dtoList;
        }

        public User GetUserByMobileAndPassword(string mobile, string password)
        {
            User user = SISPIncubatorOnlinePlatformEntitiesInstance.User.Where(u => u.Mobile == mobile && u.Password == password && u.Status == true).FirstOrDefault<User>();
            return user;
        }

        /// <summary>
        /// 更新用户头像
        /// </summary>
        /// <param name="userCreateRequest"></param>
        /// <returns></returns>
        public void UpdateUserLogo(UserCreateRequest userCreateRequest)
        {
            if (userCreateRequest != null && userCreateRequest.User != null &&
                !string.IsNullOrEmpty(userCreateRequest.LogoUrl))
            {
                WeChat weChat =
                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.FirstOrDefault(
                        d => d.UserID == userCreateRequest.User.UserID);
                if(weChat== null)
                {
                    weChat = new WeChat();
                    weChat.UserID = userCreateRequest.User.UserID;
                    weChat.WeChatID = Guid.NewGuid();
                    weChat.Headimgurl = userCreateRequest.LogoUrl;
                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Add(weChat);
                }
                else
                {
                    weChat.Headimgurl = userCreateRequest.LogoUrl;
                }
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() < 0)
                {
                    throw new BadRequestException("[UsersManager Method(void UpdateUserLogo): 更新用户头像提交出错userid=" + userCreateRequest.User.UserID + "]更新头像失败!");
                }
            }
            else
            {
                throw new BadRequestException("未获取到上传的头像信息！");
            }
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="userCreateRequest"></param>
        /// <returns></returns>
        public void UpdateUser(UserCreateRequest userCreateRequest)
        {
            User updatemodel = userCreateRequest.User;
            if (updatemodel == null)
            {
                throw new BadRequestException("[UsersManager Method(void UpdateUser): userCreateRequest is null]未获取到要更新的用户信息！");
            };
            //if (!string.IsNullOrEmpty(userCreateRequest.Code))
            //{
            //    SMSValidateCodeManager smsValidateCodeManager = new SMSValidateCodeManager();
            //    if (!smsValidateCodeManager.CheckValidateCode(userCreateRequest.Code, updatemodel.Mobile)) //check 验证码
            //    {
            //        throw new BadRequestException("[UserManager Method( void UpdateUser): 验证码验证失败]验证码不正确！");
            //    }
            //}
            WeiXinRequest weiXinRequest = userCreateRequest.WeiXinRequest;
            if (weiXinRequest != null)
            {
                WeiXinManager weiXinManager = new WeiXinManager();
                weiXinManager.GetMultimedia(weiXinRequest);
            }
            User model = SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(m => m.UserID == updatemodel.UserID);
            if (model != null)
            {
                if (updatemodel.Status == true)//启用时检查是否有此手机号，有则无法启用
                {
                    User eUser =
                        SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(
                            d => d.Mobile == updatemodel.Mobile && d.Status == true && d.UserID != updatemodel.UserID);
                    if (eUser != null)
                    {
                        throw new ConflictException("此用户的手机号已被用户名为：" + eUser.UserName + "的用户使用，无法启用相同手机号的用户！");
                    }
                }
                GetModel(updatemodel, model);
                string AddType = userCreateRequest.AddType;
                if (!string.IsNullOrEmpty(AddType) && AddType == "manager")//管理员修改状态
                {
                    model.Status = updatemodel.Status;
                }
                if (weiXinRequest != null && !string.IsNullOrEmpty(weiXinRequest.MediaID) && !string.IsNullOrEmpty(weiXinRequest.SavePath) && !string.IsNullOrEmpty(weiXinRequest.FileName))
                {
                    string fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                    if (model.WeChat.Count > 0)
                    {
                        WeChat weChat = model.WeChat.First<WeChat>();
                        weChat.Headimgurl = fileUploadFolder + "\\" + weiXinRequest.FileName + ".jpg";
                    }
                }
                //pc端更改头像
                if (!string.IsNullOrEmpty(userCreateRequest.LogoUrl))
                {
                    if (model.WeChat.Count > 0)
                    {
                        WeChat weChat = model.WeChat.First<WeChat>();
                        weChat.Headimgurl = userCreateRequest.LogoUrl;
                    }
                }
                //保存用户角色
                if (!string.IsNullOrEmpty(userCreateRequest.RoleID))
                {
                    CreateUserRoles(userCreateRequest.RoleID, updatemodel.UserID);
                }
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() < 0)
                {
                    throw new BadRequestException("[UsersManager Method(void UpdateUser): 更新提交出错Mobile=" + updatemodel.Mobile + "]更新提交出错!");
                }
            }
            else
            {
                throw new BadRequestException("[UsersManager Method(void UpdateUser): UserCreateRequest is null Mobile=" + updatemodel.Mobile + "]未获取到用户信息！");
            }
        }

        /// <summary>
        /// 审核用户
        /// </summary>
        /// <param name="userCreateRequest"></param>
        /// <returns></returns>
        public void ApproveUser(UserCreateRequest userCreateRequest)
        {
            if (userCreateRequest.User != null && !string.IsNullOrEmpty(Convert.ToString(userCreateRequest.User.UserID)))
            {
                User user =
                    SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(d => d.UserID == userCreateRequest.User.UserID);
                if (user != null)
                {
                    var regsuctip = ConfigurationManager.AppSettings["Regsuccesstip"];
                    var regerrortip = ConfigurationManager.AppSettings["Regerrortip"];
                    if (userCreateRequest.ApproveStatus == "1")
                    {
                        user.Status = true;
                        SMSHelper.SendSMS(user.Mobile, regsuctip);
                    }
                    else
                    {
                        user.Status = false;
                        SMSHelper.SendSMS(user.Mobile, regerrortip);
                    }
                    //if (userCreateRequest.User.UserType.Trim() == "企业")
                    //{
                    UserExtension userExtension =
                        SISPIncubatorOnlinePlatformEntitiesInstance.UserExtension.FirstOrDefault(
                            d => d.UserID == userCreateRequest.User.UserID);
                    if (userExtension != null)
                    {
                        userExtension.IsApproval = true;
                    }
                    //}
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("未获取到用户信息！");
            }
        }

        private void GetModel(User user, User model)
        {
            if (user != null)
            {
                model.Phone = user.Phone;
                model.Address = user.Address;
                model.Email = user.Email;
                model.UserName = user.UserName;
                model.UserType = user.UserType;
                model.Mobile = user.Mobile;
            }
        }

        //获取用户是否是孵化器品牌管理员
        public bool GetUserRole(Guid id)
        {
            bool result = false;
            var roleIds = SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles.Where(x => x.UserID == id).Select(x => x.RoleID);
            if (roleIds.Any())
            {
                foreach (var roleId in roleIds)
                {
                    var incubatorInformations = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(x => x.RoleID == roleId);
                    if (incubatorInformations.Any())
                    {
                        result = true;
                    }
                }
            }
            return result;
        }

        public byte[] Crop(string Img, int Width, int Height, int X, int Y)
        {
            using (SD.Image OriginalImage = SD.Image.FromFile(Img))
            {
                using (SD.Bitmap bmp = new SD.Bitmap(Width, Height))
                {
                    bmp.SetResolution(OriginalImage.HorizontalResolution, OriginalImage.VerticalResolution);
                    using (SD.Graphics Graphic = SD.Graphics.FromImage(bmp))
                    {
                        Graphic.SmoothingMode = SmoothingMode.AntiAlias;
                        Graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        Graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        Graphic.DrawImage(OriginalImage, new SD.Rectangle(0, 0, Width, Height), X, Y, Width, Height, SD.GraphicsUnit.Pixel);
                        MemoryStream ms = new MemoryStream();
                        bmp.Save(ms, OriginalImage.RawFormat);
                        return ms.GetBuffer();
                    }
                }
            }

        }

        /// <summary>
        /// 添加公司注册信息文件
        /// </summary>
        public void AddCompanyAttachment()
        {
            string UserID = System.Web.HttpContext.Current.Request.Params["UserID"];
            string ComName = Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["ComName"]);
            string ComDesc = System.Web.HttpContext.Current.Request.Params["ComDesc"];
            string IsAdminAddCom = System.Web.HttpContext.Current.Request.Params["IsAdminAddCom"];
            if (!string.IsNullOrEmpty(ComDesc))
            {
                ComDesc = Utility.UnicodeToString(ComDesc);
            }
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string LinensefilePath = "";
            string CardfilePath = string.Empty;
            if (hfc.Count > 0)
            {
                //新增附件
                for (int i = 0; i < hfc.Count; i++)
                {
                    if (hfc[i].ContentLength <= 0) continue;
                    string fileExtension = Path.GetExtension(hfc[i].FileName).ToLower();
                    string fileName = Path.GetFileName(hfc[i].FileName);

                    string fileUploadFolder = ConfigurationManager.AppSettings["CompanyFolder"];
                    string PhysicalPath = HttpContext.Current.Server.MapPath("../" + fileUploadFolder);
                    if (!Directory.Exists(PhysicalPath))
                    {
                        Directory.CreateDirectory(PhysicalPath);
                    }
                    string fname = fileName.Split('.')[0] + DateTime.Now.ToString("yyyyMMddHHss") + fileExtension;
                    if (i == 0)
                    {
                        LinensefilePath = fileUploadFolder + "/" + fname;
                    }
                    else
                    {
                        CardfilePath = fileUploadFolder + "/" + fname;
                    }
                    string savepath = PhysicalPath + "/" + fname;
                    hfc[i].SaveAs(savepath);

                }
                Guid uid = Guid.Parse(UserID);
                UserExtension userExtension =
                    SISPIncubatorOnlinePlatformEntitiesInstance.UserExtension.FirstOrDefault(d => d.UserID == uid);
                if (userExtension == null)
                {
                    userExtension = new UserExtension();
                    userExtension.UserID = uid;
                    userExtension.CompanyName = ComName;
                    userExtension.BusinessLicenseImg = LinensefilePath;
                    userExtension.IDCardImg = CardfilePath;
                    if (!string.IsNullOrEmpty(IsAdminAddCom) && IsAdminAddCom == "true")
                    {
                        userExtension.IsApproval = true;
                    }
                    else
                    {
                        userExtension.IsApproval = false;
                    }
                    userExtension.Description = ComDesc;
                    SISPIncubatorOnlinePlatformEntitiesInstance.UserExtension.Add(userExtension);
                }
                else
                {
                    userExtension.CompanyName = ComName;
                    if (!string.IsNullOrEmpty(LinensefilePath))
                    {
                        userExtension.BusinessLicenseImg = LinensefilePath;
                    }
                    if (!string.IsNullOrEmpty(CardfilePath))
                    {
                        userExtension.IDCardImg = CardfilePath;
                    }
                    if (!string.IsNullOrEmpty(IsAdminAddCom) && IsAdminAddCom == "true")
                    {
                        userExtension.IsApproval = true;
                    }
                    else
                    {
                        userExtension.IsApproval = false;
                    }
                    if (!string.IsNullOrEmpty(ComDesc))
                    {
                        userExtension.Description = ComDesc;
                    }
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
        }

        /// <summary>
        /// 根据角色获取用户
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<User> GetUserByRole(string roleName)
        {
            if (string.IsNullOrEmpty(roleName))
            {
                return null;
            }
            else
            {
                List<User> userList = (from u in SISPIncubatorOnlinePlatformEntitiesInstance.User
                                       join ru in SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles on u.UserID equals ru.UserID
                                       join r in SISPIncubatorOnlinePlatformEntitiesInstance.Roles on ru.RoleID equals r.RoleID
                                       where r.RoleName == roleName
                                       orderby u.Created
                                       select u
                                          ).ToList<User>();
                return userList;
            }
        }

    }


}