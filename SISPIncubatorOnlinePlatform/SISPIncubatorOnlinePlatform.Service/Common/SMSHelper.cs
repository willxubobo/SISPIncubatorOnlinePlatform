using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Xml;

namespace SISPIncubatorOnlinePlatform.Service.Common
{
    public class SMSHelper
    {
        private static string smsSN = ConfigurationManager.AppSettings["smsAccount"];
        private static string smsPwd = ConfigurationManager.AppSettings["smsPwd"];
        private static string uid = ConfigurationManager.AppSettings["uid"];
        private static string siteUrl = ConfigurationManager.AppSettings["siteUrl"];
        private static string initContent = ConfigurationManager.AppSettings["initContent"];
        /// <summary>
        /// 发送短信
        /// </summary>
        /// <param name="phones">手机号码，可以是多个号码，用分号隔开</param>
        /// <param name="content">短信内容</param>
        /// <returns></returns>
        public static bool SendSMS(string phones, string content)
        {            
            string sendContent = string.Format(initContent, content);            

            WebClient client = new WebClient();
            client.Encoding = Encoding.UTF8;
            string url = string.Format("{0}?action=send&userid={1}&account={2}&password={3}&mobile={4}&content={5}", siteUrl, uid, smsSN, smsPwd, phones, sendContent);            

            string returnContent = client.DownloadString(url);
            XmlDocument xdoc = new XmlDocument();
            xdoc.LoadXml(returnContent);
            XmlNode xn = xdoc.SelectSingleNode("returnsms/returnstatus");
            if (xn != null && xn.InnerText.Trim() == "Success")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool SendApplySMS(string phones, string content)
        {
            WebClient client = new WebClient();
            client.Encoding = Encoding.UTF8;
            string url = string.Format("{0}?action=send&userid={1}&account={2}&password={3}&mobile={4}&content={5}", siteUrl, uid, smsSN, smsPwd, phones, content);

            string returnContent = client.DownloadString(url);
            XmlDocument xdoc = new XmlDocument();
            xdoc.LoadXml(returnContent);
            XmlNode xn = xdoc.SelectSingleNode("returnsms/returnstatus");
            if (xn != null && xn.InnerText.Trim() == "Success")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}