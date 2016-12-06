using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using System.Reflection;
using SISPIncubatorOnlinePlatform.Service.Models;
using System.Text.RegularExpressions;

namespace SISPIncubatorOnlinePlatform.Service.Common
{
    public class Utility
    {
        //MD5不可逆加密 
        //32位加密 
        public static string GetMD5_32(string s)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] t = md5.ComputeHash(Encoding.GetEncoding("gb2312").GetBytes(s));
            StringBuilder sb = new StringBuilder(32);
            for (int i = 0; i < t.Length; i++)
            {
                sb.Append(t[i].ToString("x").PadLeft(2, '0'));
            }
            return sb.ToString();
        }

        //16位加密 
        public static string GetMd5_16(string ConvertString)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            string t2 = BitConverter.ToString(md5.ComputeHash(UTF8Encoding.Default.GetBytes(ConvertString)), 4, 8);
            t2 = t2.Replace("-", "");
            return t2;
        }

        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <param name="length">指定验证码的长度</param>
        /// <returns></returns>
        public static string CreateValidateCode(int length)
        {
            int[] randMembers = new int[length];
            int[] validateNums = new int[length];
            string validateNumberStr = "";
            //生成起始序列值
            int seekSeek = unchecked((int)DateTime.Now.Ticks);
            Random seekRand = new Random(seekSeek);
            int beginSeek = (int)seekRand.Next(0, Int32.MaxValue - length * 10000);
            int[] seeks = new int[length];
            for (int i = 0; i < length; i++)
            {
                beginSeek += 10000;
                seeks[i] = beginSeek;
            }
            //生成随机数字
            for (int i = 0; i < length; i++)
            {
                Random rand = new Random(seeks[i]);
                int pownum = 1 * (int)Math.Pow(10, length);
                randMembers[i] = rand.Next(pownum, Int32.MaxValue);
            }
            //抽取随机数字
            for (int i = 0; i < length; i++)
            {
                string numStr = randMembers[i].ToString();
                int numLength = numStr.Length;
                Random rand = new Random();
                int numPosition = rand.Next(0, numLength - 1);
                validateNums[i] = Int32.Parse(numStr.Substring(numPosition, 1));
            }
            //生成验证码
            for (int i = 0; i < length; i++)
            {
                validateNumberStr += validateNums[i].ToString();
            }
            return validateNumberStr;
        }

        /// <summary>
        /// 对象值拷贝
        /// </summary>
        /// <param name="destination">目标对象</param>
        /// <param name="source">源对象</param>
        /// <param name="type">源对象类型</param>
        /// <param name="excludeName">需要排除的属性名称</param>
        /// <returns></returns>
        public static void Copy(object source, object destination, Type sourceType, IEnumerable<string> excludeName)
        {
            if (destination == null || source == null)
            {
                return;
            }
            if (excludeName == null)
            {
                excludeName = new List<string>();
            }
            Type desType = destination.GetType();
            foreach (FieldInfo mi in sourceType.GetFields())
            {
                if (excludeName.Contains(mi.Name))
                {
                    continue;
                }

                FieldInfo des = desType.GetField(mi.Name);
                if (des != null && des.FieldType == mi.FieldType)
                {
                    des.SetValue(destination, mi.GetValue(source));
                }
            }

            foreach (PropertyInfo pi in sourceType.GetProperties())
            {
                if (excludeName.Contains(pi.Name))
                {
                    continue;
                }

                PropertyInfo des = desType.GetProperty(pi.Name);
                if (des != null && des.PropertyType == pi.PropertyType && des.CanWrite && pi.CanRead)
                {
                    des.SetValue(destination, pi.GetValue(source, null), null);
                }
            }
        }

        public static List<TDestination> CopyList<TSource, TDestination>(List<TSource> sourceList, List<TDestination> desList) where TDestination : new()
        {
            foreach (TSource source in sourceList)
            {
                TDestination des = new TDestination();
                Copy(source, des, typeof(TSource), null);
                desList.Add(des);
            }
            return desList;
        }

        public static void CopyDtoToDao<TSource, TResult>(TSource source, TResult result)
            where TSource : class
            where TResult : new()
        {
            Copy(source, result, typeof(TSource), null);
        }
        /// <summary>
        /// 获取服务器图片的地址
        /// </summary>
        /// <returns></returns>
        public static string GetServicesImageUrl()
        {
            return ConfigurationManager.AppSettings["ServiceImgUrl"];
        }
        /// <summary>
        /// 获取服务器的地址
        /// </summary>
        /// <returns></returns>
        public static string GetServicesUrl()
        {
            return ConfigurationManager.AppSettings["ServiceUrl"];
        }
        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="filePaths">数据库存放的路径地址，多个以,分割</param>
        public static void DeleteFileByPath(string filePaths)
        {
            string[] pathArray = filePaths.Split(',');
            
            foreach (string filePath in pathArray)
            {
                if (!string.IsNullOrEmpty(filePath))
                {
                    //string actionfilePath = "api/" + filePath;
                    string serverPath = HttpContext.Current.Server.MapPath("../"+filePath);

                    int lastIndex = serverPath.LastIndexOf('.');
                    string frontPart = serverPath.Substring(0, lastIndex);
                    string lastPart = serverPath.Substring(lastIndex);
                    string smallFilePath = frontPart + "_s" + lastPart;
                    string maxFilePath = frontPart + "_m" + lastPart;

                    FileInfo myfile = new FileInfo(serverPath);
                    
                    if (myfile.Exists)
                    {
                        FileStream fs = myfile.Create();
                        fs.Close();
                        myfile.Refresh();
                        myfile.Delete();
                    }
                    myfile = new FileInfo(smallFilePath);
                    if (myfile.Exists)
                    {
                        FileStream fs = myfile.Create();
                        fs.Close();
                        myfile.Refresh();
                        myfile.Delete();
                    }
                    myfile = new FileInfo(maxFilePath);
                    if (myfile.Exists)
                    {
                        FileStream fs = myfile.Create();
                        fs.Close();
                        myfile.Refresh();
                        myfile.Delete();
                    }
                }

            }

        }
        /// <summary>
        /// 获取图片路径
        /// </summary>
        /// <param name="sHtmlText"></param>
        /// <returns></returns>
        public static string[] GetHtmlImageUrlList(string sHtmlText)
        {
            // 定义正则表达式用来匹配 img 标签 
            Regex regImg = new Regex(@"<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>", RegexOptions.IgnoreCase);

            // 搜索匹配的字符串 
            MatchCollection matches = regImg.Matches(sHtmlText);
            int i = 0;
            string[] sUrlList = new string[matches.Count];

            // 取得匹配项列表 
            foreach (Match match in matches)
                sUrlList[i++] = match.Groups["imgUrl"].Value;
            return sUrlList;
        }
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