using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Xml;
using SISPIncubatorOnlinePlatform.Web.Wechart.Controllers;
using SISPIncubatorOnlinePlatform.Web.Wechart.Models;
using Newtonsoft.Json;

namespace SISPIncubatorOnlinePlatform.Web.Mobile
{
    /// <summary>
    /// Summary description for wechatresponse
    /// </summary>
    public class wechatresponse : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string result = string.Empty;
            //weixi _wx = new weixi();
            string postStr = "";
            if (context.Request.HttpMethod.ToLower() == "post")
            {
                Stream s = System.Web.HttpContext.Current.Request.InputStream;
                byte[] b = new byte[s.Length];
                s.Read(b, 0, (int)s.Length);
                postStr = Encoding.UTF8.GetString(b);
                if (!string.IsNullOrEmpty(postStr)) //请求处理  
                {
                    //_wx.Handle(postStr);
                    result = ResponseMsg(postStr);
                }
                else
                {
                    System.Web.HttpContext.Current.Response.Write("error");
                }
                context.Response.Write(result);
            }
            else
            {
                Auth();
            }

        }

        /// <summary>  
        /// 验证微信签名  
        /// * 将token、timestamp、nonce三个参数进行字典序排序  
        /// * 将三个参数字符串拼接成一个字符串进行sha1加密  
        /// * 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。  
        /// </summary>  
        /// <returns></returns>  
        private bool CheckSignature()
        {
            string signature = System.Web.HttpContext.Current.Request.QueryString["signature"];
            string timestamp = System.Web.HttpContext.Current.Request.QueryString["timestamp"];
            string nonce = System.Web.HttpContext.Current.Request.QueryString["nonce"];
            //加密/校验流程：  
            //1. 将token、timestamp、nonce三个参数进行字典序排序  
            string[] ArrTmp = { Token, timestamp, nonce };
            Array.Sort(ArrTmp);//字典排序  
            //2.将三个参数字符串拼接成一个字符串进行sha1加密  
            string tmpStr = string.Join("", ArrTmp);
            tmpStr = FormsAuthentication.HashPasswordForStoringInConfigFile(tmpStr, "SHA1");
            tmpStr = tmpStr.ToLower();
            //3.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。  
            if (tmpStr == signature)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        private string Token =  ConfigurationManager.AppSettings["WeChatConfigToken"];//换成自己的token  
        public void Auth()
        {
            string echoStr = System.Web.HttpContext.Current.Request.QueryString["echoStr"];
            if (CheckSignature()) //校验签名是否正确  
            {
                if (!string.IsNullOrEmpty(echoStr))
                {
                    System.Web.HttpContext.Current.Response.Write(echoStr); //返回原值表示校验成功  
                    System.Web.HttpContext.Current.Response.End();
                }
            }
            else
            {
                System.Web.HttpContext.Current.Response.Write("error"); //返回原值表示校验成功  
                System.Web.HttpContext.Current.Response.End();
            }
        }

        /// <summary>
        ///返回微信信息结果
        /// </summary>
        /// <param name="weixinXML"></param>
        private string ResponseMsg(string weixinXML)
        {
            string resxml = "";
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(weixinXML);//读取XML字符串
                XmlElement rootElement = doc.DocumentElement;
                XmlNode MsgType = rootElement.SelectSingleNode("MsgType");//获取字符串中的消息类型
                #region 暂无自动回复需求
                if (MsgType.InnerText == "text")//如果消息类型为文本消息
                {
                    var model = new
                    {
                        ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText,
                        FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText,
                        CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText,
                        MsgType = MsgType.InnerText,
                        Content = rootElement.SelectSingleNode("Content").InnerText,
                        MsgId = rootElement.SelectSingleNode("MsgId").InnerText
                    };
                    resxml += "<xml><ToUserName><![CDATA[" + model.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + model.ToUserName + "]]></FromUserName><CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime>";
                    if (!string.IsNullOrEmpty(model.Content))//如果接收到消息
                    {
                        if (model.Content.Contains("你好") || model.Content.Contains("好") || model.Content.Contains("hi") || model.Content.Contains("hello"))// 你好
                        {
                            resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好，有事请留言，偶会及时回复你的。]]></Content><FuncFlag>0</FuncFlag></xml>";
                        }
                        else
                        {
                            resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好，有事请留言，偶会及时回复你的。]]></Content><FuncFlag>0</FuncFlag></xml>";
                        }

                    }

                    else//没有接收到消息
                    {
                        resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[亲，感谢您对我的关注，有事请留言。]]></Content><FuncFlag>0</FuncFlag></xml>";
                    }

                }
                if (MsgType.InnerText == "image")//如果消息类型为图片消息
                {
                    var model = new
                    {
                        ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText,
                        FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText,
                        CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText,
                        MsgType = MsgType.InnerText,
                        PicUrl = rootElement.SelectSingleNode("PicUrl").InnerText,
                        MsgId = rootElement.SelectSingleNode("MsgId").InnerText
                    };
                    resxml += "<xml><ToUserName><![CDATA[" + model.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + model.ToUserName + "]]></FromUserName><CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[欢迎您的光临！]]></Title><Description><![CDATA[非常感谢您的关注！]]></Description><PicUrl><![CDATA[http://...jpg]]></PicUrl><Url><![CDATA[http://www.baidu.com/]]></Url></item></Articles><FuncFlag>0</FuncFlag></xml>";
                }
                #endregion
                if (MsgType.InnerText == "event")//如果消息类型为图片消息
                {
                    var model = new
                    {
                        ToUserName = rootElement.SelectSingleNode("ToUserName").InnerText,
                        FromUserName = rootElement.SelectSingleNode("FromUserName").InnerText,
                        CreateTime = rootElement.SelectSingleNode("CreateTime").InnerText,
                        MsgType = MsgType.InnerText
                    };
                    XmlNode EventType = rootElement.SelectSingleNode("Event");//获取字符串中的事件类型
                    switch (EventType.InnerText)
                    {
                        //关注的时候回复信息
                        case "subscribe":
                            //将二维码中参数保存到数据库
                            string code = rootElement.SelectSingleNode("EventKey").InnerText.Replace("qrscene_", "");
                            string para = JsonConvert.SerializeObject(new WeiXinRequest(code, model.FromUserName));
                            AddWeChatCode("/api/weixin/weixincode", para);
                            
                            resxml += "<xml><ToUserName><![CDATA[" + model.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + model.ToUserName + "]]></FromUserName><CreateTime>" + ConvertDateTimeInt(DateTime.Now) + "</CreateTime>";
                            resxml += "<MsgType><![CDATA[text]]></MsgType><Content><![CDATA[亲，感谢您对我的关注，有事请留言。]]></Content><FuncFlag>0</FuncFlag></xml>";
                            break;
                        case "unsubscribe"://取消关注事件　
                            //resXml = replyset.GetSubscribe(requestXml.FromUserName, requestXml.ToUserName);
                            break;
                            //扫描二维码
                            case "SCAN":
                            string codec = rootElement.SelectSingleNode("EventKey").InnerText.Replace("qrscene_", "");
                            string parac = JsonConvert.SerializeObject(new WeiXinRequest(codec, model.FromUserName));
                            AddWeChatCode("/api/weixin/weixincode", parac);
                                break;
                        //自定义菜单的时候回复信息
                        default: break;
                        //resXml = replyset.GetMenuClick(requestXml.FromUserName, requestXml.ToUserName, requestXml.EventKey);
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
                //    Response.Write(resxml);
                //}
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return resxml;
        }
        //关注或扫描后添加数据
        protected void AddWeChatCode(string requesturi,string para)
        {
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = requesturi;
            httpRequestBody.requestParameters = para;
            HttpProxyController httpProxyController = new HttpProxyController();
            httpProxyController.AnonymousPostProxy(httpRequestBody);
        }
        /// <summary>  
        /// unix时间转换为datetime  
        /// </summary>  
        /// <param name="timeStamp"></param>  
        /// <returns></returns>  
        public DateTime UnixTimeToTime(string timeStamp)
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            long lTime = long.Parse(timeStamp + "0000000");
            TimeSpan toNow = new TimeSpan(lTime);
            return dtStart.Add(toNow);
        }


        /// <summary>  
        /// datetime转换为unixtime  
        /// </summary>  
        /// <param name="time"></param>  
        /// <returns></returns>  
        public int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }
    }
}