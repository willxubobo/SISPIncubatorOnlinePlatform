using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Xml;
using Newtonsoft.Json;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SISPIncubatorOnlinePlatform.Service.Common;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class WeiXinManager : BaseManager
    {
        private static readonly string[] strs = new string[]
                                 {
                                  "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
                                  "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
                                 };
        /// <summary>
        /// 获取用户微信信息
        /// </summary>
        /// <param name="weiXinRequest"></param>
        /// <returns></returns>
        public WeChatDTO GetUserInfo(WeiXinRequest weiXinRequest)
        {
            WeChatDTO weChatDto = new WeChatDTO();
            var appid = ConfigurationManager.AppSettings["AppID"];
            var secret = ConfigurationManager.AppSettings["AppSecret"];

            var code = weiXinRequest.Code;
            if (string.IsNullOrEmpty(code))
            {
                var authorizeUrl = ConfigurationManager.AppSettings["AuthorizeUrl"];
                var url = string.Format(authorizeUrl, appid, HttpUtility.UrlEncode(weiXinRequest.PageUrl));
                weChatDto.RedirectUrl = url;
            }
            else
            {
                using (var client = new System.Net.WebClient())
                {
                    client.Encoding = System.Text.Encoding.UTF8;
                    var authtokenurl = ConfigurationManager.AppSettings["AuthTokenUrl"];
                    var url = string.Format(authtokenurl, appid, secret, code);
                    var data = client.DownloadString(url);
                    var obj = JsonConvert.DeserializeObject<Dictionary<string, string>>(data);
                    string accessToken;
                    if (!obj.TryGetValue("access_token", out accessToken))
                    {
                        throw new BadRequestException("[获取access_token失败]获取用户微信信息失败！");
                    }

                    var opentid = obj["openid"];
                    var userinfoUrl = ConfigurationManager.AppSettings["GetUserInfoUrl"];
                    url = string.Format(userinfoUrl, accessToken, opentid);
                    data = client.DownloadString(url);
                    if (string.IsNullOrEmpty(data))
                    {
                        throw new BadRequestException("获取用户详细信息失败！");
                    }
                    weChatDto.Nickname = GetJsonValue(data, "nickname");
                    // weChatDto.Subscribe = Convert.ToBoolean(GetJsonValue(data, "subscribe"));
                    weChatDto.Sex = GetJsonValue(data, "sex");
                    weChatDto.City = GetJsonValue(data, "city");
                    weChatDto.Province = GetJsonValue(data, "province");
                    weChatDto.Country = GetJsonValue(data, "country");
                    weChatDto.Headimgurl = GetJsonValue(data, "headimgurl");
                    weChatDto.OpenID = GetJsonValue(data, "openid");
                }
                //weChatDto.GroupID = GetJsonValue(data, "groupID");
            }
            return weChatDto;
        }

        //获取微信access_token 
        public string GetAccess_Token()
        {
            var appid = ConfigurationManager.AppSettings["AppID"];
            var secret = ConfigurationManager.AppSettings["AppSecret"];
            var getTokenUrl = ConfigurationManager.AppSettings["GetAccessTokenUrl"];
            string access_token = string.Empty;
            WeChatAccessToken weChatAccessToken =
                SISPIncubatorOnlinePlatformEntitiesInstance.WeChatAccessToken.FirstOrDefault(d => d.Key == "accesstoken");
            if (weChatAccessToken != null)
            {
                int ExpireMinutes = Convert.ToInt32(ConfigurationManager.AppSettings["AccessTokenExpiredDate"]);
                TimeSpan ts = DateTime.Now - weChatAccessToken.Created;
                if (ts.TotalMinutes > ExpireMinutes)//token超过有效期后重新获取
                {
                    string strJson = RequestUrl(string.Format(getTokenUrl, appid, secret));
                    access_token = GetJsonValue(strJson, "access_token");
                    weChatAccessToken.Value = access_token;
                    weChatAccessToken.Created = DateTime.Now;
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    access_token = weChatAccessToken.Value;
                }
            }
            else
            {
                string strJson = RequestUrl(string.Format(getTokenUrl, appid, secret));
                access_token = GetJsonValue(strJson, "access_token");
                WeChatAccessToken weChatAccess = new WeChatAccessToken();
                weChatAccess.Key = "accesstoken";
                weChatAccess.Value = access_token;
                weChatAccess.Created = DateTime.Now;
                SISPIncubatorOnlinePlatformEntitiesInstance.WeChatAccessToken.Add(weChatAccess);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            return access_token;
        }

        //获取微信apiticket
        public string GetApiTicket()
        {
            var GetApiTicketUrl = ConfigurationManager.AppSettings["GetApiTicketUrl"];
            string apiticket = string.Empty;
            WeChatAccessToken weChatAccessToken =
                SISPIncubatorOnlinePlatformEntitiesInstance.WeChatAccessToken.FirstOrDefault(d => d.Key == "apiticket");
            if (weChatAccessToken != null)
            {
                int ExpireMinutes = Convert.ToInt32(ConfigurationManager.AppSettings["AccessTokenExpiredDate"]);
                TimeSpan ts = DateTime.Now - weChatAccessToken.Created;
                if (ts.TotalMinutes > ExpireMinutes)//token超过有效期后重新获取
                {
                    string strJson = RequestUrl(string.Format(GetApiTicketUrl, GetAccess_Token()));
                    apiticket = GetJsonValue(strJson, "ticket");
                    weChatAccessToken.Value = apiticket;
                    weChatAccessToken.Created = DateTime.Now;
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    apiticket = weChatAccessToken.Value;
                }
            }
            else
            {
                string strJson = RequestUrl(string.Format(GetApiTicketUrl, GetAccess_Token()));
                apiticket = GetJsonValue(strJson, "ticket");
                WeChatAccessToken weChatAccess = new WeChatAccessToken();
                weChatAccess.Key = "apiticket";
                weChatAccess.Value = apiticket;
                weChatAccess.Created = DateTime.Now;
                SISPIncubatorOnlinePlatformEntitiesInstance.WeChatAccessToken.Add(weChatAccess);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();

            }
            return apiticket;
        }

        //关注成功后添加二维码中code到数据库
        public void AddQrCode(WeiXinRequest weiXinRequest)
        {
            if (weiXinRequest != null && !string.IsNullOrEmpty(weiXinRequest.Code))
            {
                int rdm = Convert.ToInt32(weiXinRequest.Code);
                WeChatRandom chatRandom =
                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChatRandom.FirstOrDefault(d => d.OpenID == weiXinRequest.OpenID);
                if (chatRandom != null)
                {
                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChatRandom.Remove(chatRandom);
                }
                WeChatRandom weChatRandom = new WeChatRandom();
                weChatRandom.OpenID = weiXinRequest.OpenID;
                weChatRandom.Random = rdm;
                SISPIncubatorOnlinePlatformEntitiesInstance.WeChatRandom.Add(weChatRandom);
                
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
        }

        //根据二维码中参数获取用户是否关注
        public User GetExistsByCode(string code)
        {
            User user = new User();
            user.Mobile = "nodata";
            if (!string.IsNullOrEmpty(code))
            {
                int icode = Convert.ToInt32(code);
                WeChatRandom weChatRandom =
                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChatRandom.FirstOrDefault(
                        d => d.Random == icode);
                if (weChatRandom != null)
                {
                    user.Mobile = "showlogin";
                    user.UserName = weChatRandom.OpenID;
                    if (!string.IsNullOrEmpty(weChatRandom.OpenID))
                    {
                        WeChat weChat =
                            SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.FirstOrDefault(
                                d => d.OpenID == weChatRandom.OpenID);
                        if (weChat != null)
                        {
                            user =
                                SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(
                                    d => d.UserID == weChat.UserID && d.Status == true);
                            if (user == null)
                            {
                                user = new User();
                                user.Mobile = "showlogin";
                                user.UserName = weChatRandom.OpenID;
                            }
                        }
                    }
                    SISPIncubatorOnlinePlatformEntitiesInstance.WeChatRandom.Remove(weChatRandom);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
            }
            return user;
        }

        //获取微信二维码图片地址
        public string GetQrCodeUrl(int code)
        {
            string codeurl = string.Empty;
            string ticket = string.Empty;
            var getTokenUrl = ConfigurationManager.AppSettings["GetQrCodeUrl"];
            string strJson = "{\"expire_seconds\":1800,\"action_name\":\"QR_SCENE\",\"action_info\":{\"scene\":{\"scene_id\":"+code+"}}}";
            string wxurl = string.Format(getTokenUrl, GetAccess_Token());
            ticket = GetPage(wxurl, strJson);
            ticket = GetJsonValue(ticket, "ticket");
            var getcodeUrl = ConfigurationManager.AppSettings["GetCodeUrl"];
            if (!string.IsNullOrEmpty(ticket))
            {
                codeurl=string.Format(getcodeUrl, HttpContext.Current.Server.UrlEncode(ticket));
                //string strCodeJson = RequestUrl(string.Format(getcodeUrl, HttpContext.Current.Server.UrlEncode(ticket)), "GET");
                //codeurl = GetJsonValue(strCodeJson, "url");

            }
            return codeurl;
        }

        //public string GetTicketImage(string ticket)
        //{
        //    string content = string.Empty;
        //    string strpath = string.Empty;
        //    string savepath = string.Empty;
        //    var getcodeUrl = ConfigurationManager.AppSettings["GetCodeUrl"];
        //    string stUrl = string.Format(getcodeUrl, HttpContext.Current.Server.UrlEncode(ticket));
        //    HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(stUrl);
        //    req.Method = "GET";
        //    using (WebResponse wr = req.GetResponse())
        //    {
        //        HttpWebResponse myResponse = (HttpWebResponse)req.GetResponse();
        //        strpath = myResponse.ResponseUri.ToString();
        //        WebClient mywebclient = new WebClient();
        //        savepath = Server.MapPath("image") + "\\" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + (new Random()).Next().ToString().Substring(0, 4) + "." + myResponse.ContentType.Split('/')[1].ToString();

        //        try
        //        {
        //            mywebclient.DownloadFile(strpath, savepath);
        //        }
        //        catch (Exception ex)
        //        {
        //            savepath = ex.ToString();
        //        }


        //    }
        //    return strpath.ToString();
        //}

        /// <summary>
        /// 创建二维码ticket
        /// </summary>
        /// <returns></returns>
        public string CreateTicket()
        {
            string result = "";
            var getTokenUrl = ConfigurationManager.AppSettings["GetQrCodeUrl"];
            //string strJson = @"{""expire_seconds"":1800, ""action_name"": ""QR_SCENE"", ""action_info"": {""scene"": {""scene_id"":100000023}}}";
            string strJson = "{\"action_name\": \"QR_LIMIT_SCENE\", \"action_info\": {\"scene\": {\"scene_id\":100020094}}}";
            string wxurl = string.Format(getTokenUrl, GetAccess_Token());

            WebClient myWebClient = new WebClient();
            myWebClient.Credentials = CredentialCache.DefaultCredentials;
            result = myWebClient.UploadString(wxurl, "POST", strJson);
            result = GetJsonValue(result, "ticket");
            return result;
        }
        /// <summary>
        /// 请求Url，不发送数据
        /// </summary>
        public string RequestUrl(string url)
        {
            return RequestUrl(url, "POST");
        }

        /// <summary>
        /// 请求Url，不发送数据
        /// </summary>
        public string RequestUrl(string url, string method)
        {
            // 设置参数
            HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
            CookieContainer cookieContainer = new CookieContainer();
            request.CookieContainer = cookieContainer;
            request.AllowAutoRedirect = true;
            request.Method = method;
            request.ContentType = "text/html";
            request.Headers.Add("charset", "utf-8");
            string content = string.Empty;
            //发送请求并获取相应回应数据
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                //直到request.GetResponse()程序才开始向目标网页发送Post请求
                Stream responseStream = response.GetResponseStream();
                StreamReader sr = new StreamReader(responseStream, Encoding.UTF8);
                //返回结果网页（html）代码
                content = sr.ReadToEnd();
                sr.Close();
                responseStream.Close();
            }
            return content;
        }

        /// <summary>
        /// 获取Json字符串某节点的值
        /// </summary>
        public string GetJsonValue(string jsonStr, string key)
        {
            string result = string.Empty;
            if (!string.IsNullOrEmpty(jsonStr))
            {
                key = "\"" + key.Trim('"') + "\"";
                int index = jsonStr.IndexOf(key) + key.Length + 1;
                if (index > key.Length + 1)
                {
                    //先截逗号，若是最后一个，截“｝”号，取最小值
                    int end = jsonStr.IndexOf(',', index);
                    if (end == -1)
                    {
                        end = jsonStr.IndexOf('}', index);
                    }

                    result = jsonStr.Substring(index, end - index);
                    result = result.Trim(new char[] { '"', ' ', '"' }); //过滤引号或空格
                }
            }
            return result;
        }

        /// <summary>
        /// 创建随机字符串  
        /// </summary>
        /// <returns></returns>
        public string CreatenNonce_str()
        {
            Random r = new Random();
            var sb = new StringBuilder();
            var length = strs.Length;
            for (int i = 0; i < 15; i++)
            {
                sb.Append(strs[r.Next(length - 1)]);
            }
            return sb.ToString();
        }

        /// <summary>
        /// 创建时间戳       
        /// </summary>
        /// <returns></returns>
        public long CreatenTimestamp()
        {
            return (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000;
        }

        //配置sdk
        public string ConfigWeiXinInfo(WeiXinRequest weiXinRequest)
        {
            if (weiXinRequest == null)
            {
                throw new BadRequestException("未获取到页面地址！");
            }
            string appID = ConfigurationManager.AppSettings["AppID"];
            string ticketdata = String.Empty;
            long timestamp = CreatenTimestamp();//时间戳
            string nonceStr = CreatenNonce_str();//随机数
            string jsapi_ticket = GetApiTicket();
            if (!string.IsNullOrEmpty(jsapi_ticket))
            {
                string url = weiXinRequest.PageUrl.Split('#')[0];
                string signature = GetSignature(jsapi_ticket, nonceStr, timestamp, url); //微信签名
                ticketdata += "{\"appId\":\"" + appID + "\", \"timestamp\":" + timestamp + ",\"nonceStr\":\"" + nonceStr +
                              "\",\"signature\":\"" + signature + "\"}";
            }
            return ticketdata;
        }

        /// <summary>
        /// 签名算法       
        /// </summary>
        /// <param name="jsapi_ticket">jsapi_ticket</param>
        /// <param name="noncestr">随机字符串(必须与wx.config中的nonceStr相同)</param>
        /// <param name="timestamp">时间戳(必须与wx.config中的timestamp相同)</param>
        /// <param name="url">当前网页的URL，不包含#及其后面部分(必须是调用JS接口页面的完整URL)</param>
        /// <returns></returns>
        public string GetSignature(string jsapi_ticket, string noncestr, long timestamp, string url)
        {
            var string1Builder = new StringBuilder();
            string1Builder.Append("jsapi_ticket=").Append(jsapi_ticket).Append("&")
                          .Append("noncestr=").Append(noncestr).Append("&")
                          .Append("timestamp=").Append(timestamp).Append("&")
                          .Append("url=").Append(url.IndexOf("#") >= 0 ? url.Substring(0, url.IndexOf("#")) : url);
            string string1 = string1Builder.ToString();
            return FormsAuthentication.HashPasswordForStoringInConfigFile(string1, "SHA1");
        }

        /// <summary>
        /// 下载保存多媒体文件,返回多媒体保存路径
        /// </summary>
        /// <param name="weiXinRequest"></param>
        /// <returns></returns>
        public void GetMultimedia(WeiXinRequest weiXinRequest)
        {
            if (weiXinRequest == null || string.IsNullOrEmpty(weiXinRequest.MediaID) || string.IsNullOrEmpty(weiXinRequest.FileName) || string.IsNullOrEmpty(weiXinRequest.SavePath))
            {
                return;
                //throw new BadRequestException("未获取到文件信息！");
            }
            string downLoadFileUrl = ConfigurationManager.AppSettings["DownLoadFileUrl"];
            //string file = string.Empty;
            //string content = string.Empty;
            string strpath = string.Empty;
            string savepath = string.Empty;
            string accesstoken = GetAccess_Token();
            string[] medialist = weiXinRequest.MediaID.TrimEnd(',').Split(',');
            string[] filenames = weiXinRequest.FileName.TrimEnd(',').Split(',');
            string[] fileurls = weiXinRequest.SavePath.TrimEnd(',').Split(',');
            bool mulurl = false;
            if (fileurls.Length < filenames.Length)
            {
                mulurl = true;
            }
            for (int i = 0; i < medialist.Length; i++)
            {
                if (string.IsNullOrEmpty(medialist[i]) || string.IsNullOrEmpty(filenames[i]))
                {
                    continue;
                }
                string stUrl = string.Format(downLoadFileUrl, accesstoken, medialist[i]);
                HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(stUrl);
                req.Method = "GET";
                //using (WebResponse wr = req.GetResponse())
                //{
                using (HttpWebResponse myResponse = (HttpWebResponse)req.GetResponse())
                {
                    strpath = myResponse.ResponseUri.ToString();
                    using (WebClient mywebclient = new WebClient())
                    {
                        string fileUploadFolder = string.Empty;
                        if (mulurl)
                        {
                            fileUploadFolder = ConfigurationManager.AppSettings[fileurls[0]];
                        }
                        else
                        {
                            fileUploadFolder = ConfigurationManager.AppSettings[fileurls[i]];
                        }
                        string filePath = HttpContext.Current.Server.MapPath(fileUploadFolder);
                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        savepath = filePath + "\\" + filenames[i] + ".jpg";
                        try
                        {
                            mywebclient.DownloadFile(strpath, savepath);
                            //file = weiXinRequest.SavePath + "\\" + filename + ".jpg";
                            ImageHelper.GetReducedImage(savepath);
                        }
                        catch (Exception ex)
                        {
                            throw new BadRequestException("上传文件失败！");
                        }
                    }
                }
                // }
            }
            //return file;
        }

        //删除微信公众号中菜单
        public string DelWeChatMenu()
        {
            string accesstoken = GetAccess_Token();
            string delMenuUrl = ConfigurationManager.AppSettings["DelMenuUrl"];
            string cresult = RequestUrl(string.Format(delMenuUrl, accesstoken), "GET");
            return GetJsonValue(cresult, "errcode");
        }

        //添加微信公众号中菜单
        public string AddWeChatMenu()
        {
            FileStream fs1 = new FileStream(HttpContext.Current.Server.MapPath(".") + "\\WeChat\\wechatmenu.txt", FileMode.Open);
            StreamReader sr = new StreamReader(fs1, Encoding.GetEncoding("UTF-8"));
            string menu = sr.ReadToEnd();
            sr.Close();
            fs1.Close();
            string accesstoken = GetAccess_Token();
            string addMenuUrl = ConfigurationManager.AppSettings["AddMenuUrl"];
            string cresult = GetPage(string.Format(addMenuUrl, accesstoken), menu);
            return GetJsonValue(cresult, "errcode");
        }

        //获取微信信息
        public string GetPage(string posturl, string postData)
        {
            Stream outstream = null;
            Stream instream = null;
            StreamReader sr = null;
            HttpWebResponse response = null;
            HttpWebRequest request = null;
            Encoding encoding = Encoding.UTF8;
            byte[] data = encoding.GetBytes(postData);
            // 准备请求...
            try
            {
                // 设置参数 
                request = WebRequest.Create(posturl) as HttpWebRequest;
                CookieContainer cookieContainer = new CookieContainer();
                request.CookieContainer = cookieContainer;
                request.AllowAutoRedirect = true;
                request.Method = "POST";
                request.ContentType = "application/json";
                request.ContentLength = data.Length;
                outstream = request.GetRequestStream();
                outstream.Write(data, 0, data.Length);

                string content = string.Empty;
                //发送请求并获取相应回应数据
                using (response = request.GetResponse() as HttpWebResponse)
                {
                    //直到request.GetResponse()程序才开始向目标网页发送Post请求
                    instream = response.GetResponseStream();
                    sr = new StreamReader(instream, encoding);
                    //返回结果网页（html）代码
                    content = sr.ReadToEnd();
                }
                return content;
            }
            catch (Exception ex)
            {
                throw new BadRequestException("创建菜单失败！");
            }
            finally
            {
                outstream.Close();
                instream.Close();
                sr.Close();
            }
        }

        /// <summary>
        ///返回微信信息结果
        /// </summary>
        /// <param name="weixinXML"></param>
        public string ResponseMsg(string weixinXML)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(weixinXML);//读取XML字符串
            XmlElement rootElement = doc.DocumentElement;

            XmlNode MsgType = rootElement.SelectSingleNode("MsgType");//获取字符串中的消息类型

            string resxml = "";
            #region 自动回复功能暂时不需要
            //if (MsgType.InnerText == "text")//如果消息类型为文本消息
            //{
            //    var model = new
            //    {
            //        ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText,
            //        FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText,
            //        CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText,
            //        MsgType = MsgType.InnerText,
            //        Content = rootElement.SelectSingleNode("Content").InnerText,
            //        MsgId = rootElement.SelectSingleNode("MsgId").InnerText
            //    };
            //    resxml += "<xml><ToUserName><![CDATA[" + model.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + model.ToUserName + "]]></FromUserName><CreateTime>" + WeiXinDevCommon.ConvertDateTimeInt(DateTime.Now) + "</CreateTime>";
            //    if (!string.IsNullOrEmpty(model.Content))//如果接收到消息
            //    {
            //        if (model.Content.Contains("你好") || model.Content.Contains("好") || model.Content.Contains("hi") || model.Content.Contains("hello"))// 你好
            //        {
            //            resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好，有事请留言，偶会及时回复你的。]]></Content><FuncFlag>0</FuncFlag></xml>";
            //        }
            //        else
            //        {
            //            resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好，有事请留言，偶会及时回复你的。]]></Content><FuncFlag>0</FuncFlag></xml>";
            //        }

            //    }

            //    else//没有接收到消息
            //    {
            //        resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[亲，感谢您对我的关注，有事请留言。]]></Content><FuncFlag>0</FuncFlag></xml>";
            //    }
            //}
            //if (MsgType.InnerText == "image")//如果消息类型为图片消息
            //{
            //    var model = new
            //    {
            //        ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText,
            //        FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText,
            //        CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText,
            //        MsgType = MsgType.InnerText,
            //        PicUrl = rootElement.SelectSingleNode("PicUrl").InnerText,
            //        MsgId = rootElement.SelectSingleNode("MsgId").InnerText
            //    };
            //    resxml += "<xml><ToUserName><![CDATA[" + model.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + model.ToUserName + "]]></FromUserName><CreateTime>" + WeiXinDevCommon.ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[欢迎您的光临！]]></Title><Description><![CDATA[非常感谢您的关注！]]></Description><PicUrl><![CDATA[http://...jpg]]></PicUrl><Url><![CDATA[http://www.baidu.com/]]></Url></item></Articles><FuncFlag>0</FuncFlag></xml>";
            //}
            #endregion
            if (MsgType.InnerText == "event")//如果消息类型为图片消息
            {
                XmlNode EventType = rootElement.SelectSingleNode("Event");//获取字符串中的事件类型
                switch (EventType.InnerText)
                {
                    //关注的时候回复信息
                    case "subscribe":
                        //resXml = replyset.GetSubscribe(requestXml.FromUserName, requestXml.ToUserName);
                        resxml = "subscribe";
                        break;
                    case "unsubscribe"://取消关注事件　
                        //resXml = replyset.GetSubscribe(requestXml.FromUserName, requestXml.ToUserName);
                        break;
                    //自定义菜单的时候回复信息
                    case "CLICK":
                        //resXml = replyset.GetMenuClick(requestXml.FromUserName, requestXml.ToUserName, requestXml.EventKey);
                        break;
                }
            }

            //else//如果是其余的消息类型
            //{
            //    var model = new
            //    {
            //        ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText,
            //        FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText,
            //        CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText,
            //    };
            //    resxml += "<xml><ToUserName><![CDATA[" + model.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + model.ToUserName + "]]></FromUserName><CreateTime>" + WeiXinDevCommon.ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[亲，感谢您对我的关注，有事请留言，我会及时回复你的哦。]]></Content><FuncFlag>0</FuncFlag></xml>";
            //}
            return resxml;
        }
    }
}