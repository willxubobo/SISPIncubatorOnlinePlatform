using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class WeiXinController : BaseController, IWeiXin
    {
        WeiXinManager _weiXinManager = new WeiXinManager();

        [HttpPost]
        [Route("weixin")]
        public IHttpActionResult GetUserInfo(WeiXinRequest weiXinRequest)
        {
            WeChatDTO weChatDto = _weiXinManager.GetUserInfo(weiXinRequest);
            return Ok(weChatDto);
        }

        [HttpPost]
        [Route("weixin/ticket")]
        public IHttpActionResult GetTicket(WeiXinRequest weiXinRequest)
        {
            string ticket = _weiXinManager.ConfigWeiXinInfo(weiXinRequest);
            return Ok(ticket);
        }

        [HttpPost]
        [Route("weixin/media")]
        public IHttpActionResult GetMultimedia(WeiXinRequest weiXinRequest)
        {
            _weiXinManager.GetMultimedia(weiXinRequest);
            return Ok();
        }

        [HttpPost]
        [Route("weixin/addmenu")]
        //添加微信公众号中菜单
        public IHttpActionResult AddWeChatMenu()
        {
            string result = _weiXinManager.AddWeChatMenu();
            return Ok(result);
        }

        [HttpPost]
        [Route("weixin/delmenu")]
        //删除微信公众号中菜单
        public IHttpActionResult DelWeChatMenu()
        {
            string result = _weiXinManager.DelWeChatMenu();
            return Ok(result);
        }

        [HttpPost]
        [Route("weixin/codeurl/{code:int}")]
        //获取二维码地址
        public IHttpActionResult GetCodeUrl(int code)
        {
            string result = _weiXinManager.GetQrCodeUrl(code);
            return Ok(result);
        }

        [HttpPost]
        [Route("weixin/weixincode")]
        //用户关注后添加数据
        public IHttpActionResult AddCode(WeiXinRequest weiXinRequest)
        {
            _weiXinManager.AddQrCode(weiXinRequest);
            return Ok();
        }

        [HttpPost]
        [Route("weixin/subscribe/{code}")]
        //获取用户是否关注
        public IHttpActionResult Subscribe(string code)
        {
           User user= _weiXinManager.GetExistsByCode(code);
           Dictionary<string, string> userProperties = null;
           if (user != null)
           {
               string headurl = string.Empty;
               if (user.WeChat.Count > 0)
               {
                   WeChat weChat = user.WeChat.FirstOrDefault();
                   headurl = weChat.Headimgurl;
                   if (!weChat.Headimgurl.Contains("http"))
                   {
                       var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                       headurl = serviceUrl + weChat.Headimgurl;
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
                      "user_pwd", user.Password
                    }
                };
           }
           return Ok(userProperties);
        }

    }
}
