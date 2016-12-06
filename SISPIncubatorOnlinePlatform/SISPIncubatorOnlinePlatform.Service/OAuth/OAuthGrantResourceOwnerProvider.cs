using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.OAuth
{
    public class OAuthGrantResourceOwnerProvider : OAuthAuthorizationServerProvider
    {
        private readonly SISPIncubatorOnlinePlatformEntities sispContext = new SISPIncubatorOnlinePlatformEntities();

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
            return Task.FromResult<object>(null);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            if (string.IsNullOrEmpty(context.UserName.Trim()))
            {
                LoggerHelper.Error(string.Format("手机号为空. Mobile: {0}", context.UserName));
                context.SetError("invalid_grant", "请输入手机号！");
                return;
            }

            if (string.IsNullOrEmpty(context.Password))
            {
                LoggerHelper.Error(string.Format("密码为空. Password: {0}", context.Password));
                context.SetError("invalid_grant", "请输入密码！");
                return;
            }
            UserManager userManager = new UserManager();
            //业务需求上，登录名使用手机号码登录
            IList<string> list = context.Scope;
            bool isManage = false;
            bool isRight = false;
            bool isScan = false;
            foreach (string s in list)
            {
                if (!string.IsNullOrEmpty(s) && s == "manage")
                {
                    isManage = true;
                    break;
                }
                if (!string.IsNullOrEmpty(s) && s == "scan")//二维码扫描登录时密码不需要编码
                {
                    isScan = true;
                    break;
                }
            }

            string ip = HttpContext.Current.Request.UserHostAddress;

            string password = Utility.GetMD5_32(context.Password);
            if (isScan)
            {
                password = context.Password;
            }
            User user = userManager.GetUserByMobileAndPassword(context.UserName, password);
         
            if (user == null)
            {
                LoggerHelper.Error(string.Format("手机号或密码错误. mobile: {0}, password: {1}", context.UserName, context.Password));
                context.SetError("invalid_grant", "手机号或密码错误！");
                return;
            }
            //判断当前用户是否有权力登陆后台
            foreach (User_Roles userRoles in user.User_Roles)
            {
                Roles roles = userRoles.Roles;
                if (roles != null && Convert.ToBoolean(roles.IsAdmin))
                {
                    isRight = true;
                }
            }
           
            if (isManage && !isRight)
            {
                LoggerHelper.Error(string.Format("你没有权力登陆后台管理系统，手机号或密码错误. mobile: {0}, password: {1}", context.UserName, context.Password));
                context.SetError("invalid_grant", "你没有权力登陆后台管理系统！");
                return;
            }
            //更新最后登录时间和登陆次数
            userManager.UpdateLastLoginData(context.UserName);

            //Allow the cross domain access
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Role, "user"));
            identity.AddClaim(new Claim("sub", context.UserName));
            string headurl = string.Empty;
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            if (user.WeChat.Count > 0)
            {
                WeChat weChat = user.WeChat.First<WeChat>();
                headurl = weChat.Headimgurl;
            }
            else
            {
                headurl = serviceUrl + "default_pic.jpg";
            }
            var props = new AuthenticationProperties(new Dictionary<string, string>
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
                  "user_avatar", headurl
                },
                {
                  "user_email", user.Email
                },
                {
                  "user_address", user.Address
                },
                {
                  "user_id", user.UserID.ToString()
                }
            });
            string authExpiries = ConfigurationManager.AppSettings["AuthExpiries"];
            int expiriesMinites = 30;
            if (authExpiries.Length > 0)
            {
                int.TryParse(authExpiries, out expiriesMinites);
            }
            var currentUtc = DateTime.UtcNow;
            props.IssuedUtc = currentUtc;
            props.ExpiresUtc = new DateTimeOffset(currentUtc.AddMinutes(expiriesMinites));
            var ticket = new AuthenticationTicket(identity, props);          
            context.Validated(ticket);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key.Replace(".", ""), property.Value);
            }
            return Task.FromResult<object>(null);
        }
    }
}