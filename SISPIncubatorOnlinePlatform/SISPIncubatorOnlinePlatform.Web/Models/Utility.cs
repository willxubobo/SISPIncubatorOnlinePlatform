using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Models 
{
    public class Utility
    {
        /// <summary>
        /// 编码成Unicode
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string StringToUnicode(string text)
        {
            text = text.Replace("\r\n", "<br>");
            bool flag = false;
            string strUni = null;
            string temp = null;

            foreach (char c in text)
            {
                temp = string.Format("{0:x}", (int)c);

                if (temp.Length < 3)
                    temp = "00" + temp;

                if (flag)
                    strUni += "0x" + temp;
                else
                    strUni += "0x" + temp;

                if (!flag)
                    flag = true;
            }
            return strUni;
        }
        /// <summary>
        /// Unicode解码
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string UnicodeToString(string text)
        {
            if (string.IsNullOrEmpty(text)) return null;

            string temp = null;
            bool flag = false;

            int len = text.Length / 4;
            if (text.StartsWith("0x") || text.StartsWith("0X"))
            {
                len = text.Length / 6;//Unicode字符串中有0x
                flag = true;
            }

            StringBuilder sb = new StringBuilder(len);
            for (int i = 0; i < len; i++)
            {
                if (flag)
                    temp = text.Substring(i * 6, 6).Substring(2);
                else
                    temp = text.Substring(i * 4, 4);

                byte[] bytes = new byte[2];
                bytes[1] = byte.Parse(int.Parse(temp.Substring(0, 2), NumberStyles.HexNumber).ToString());
                bytes[0] = byte.Parse(int.Parse(temp.Substring(2, 2), NumberStyles.HexNumber).ToString());
                sb.Append(Encoding.Unicode.GetString(bytes));
            }
            return sb.ToString().Replace("<br>","\r\n");
        }
    }
}