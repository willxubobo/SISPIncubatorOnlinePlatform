using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Timers;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using RestSharp;
using SISPIncubatorOnlinePlatform.Web.Controllers;
using SISPIncubatorOnlinePlatform.Web.Models;

namespace SISPIncubatorOnlinePlatform.Web.Module
{
    public class MyHttpModule : IHttpModule
    {
        private readonly static string backendServiceEndPoint = ConfigurationManager.AppSettings["BackendServiceEndPoint"];

        void IHttpModule.Dispose() { }

        void IHttpModule.Init(HttpApplication context)
        {
            context.BeginRequest += new EventHandler(context_BeginRequest);
        }

        private static Dictionary<string, short> _IpAdresses = new Dictionary<string, short>();

        private static Stack<string> _Banned ;

        public static Stack<string> Banned
        {
            set { _Banned = value; }
            get
            {
                if (_Banned==null)
                {
                    _Banned=new Stack<string>();
                    List<BlockedIP> list = GetBlockedIps();
                    if (list != null)
                    {
                        foreach (BlockedIP blockedIp in list)
                        {
                            _Banned.Push(blockedIp.BlockIP);
                        }
                    }

                }
                return _Banned;
            }
        }


        private static int BANNED_REQUESTS = string.IsNullOrEmpty(ConfigurationManager.AppSettings["MaxAccessNumber"]) ? 10000 : Convert.ToInt32(ConfigurationManager.AppSettings["MaxAccessNumber"]); //规定时间内访问的最大次数  
        private static int REDUCTION_INTERVAL = string.IsNullOrEmpty(ConfigurationManager.AppSettings["TimePeriod"]) ? 60000 : Convert.ToInt32(ConfigurationManager.AppSettings["TimePeriod"]); // 1 秒（检查访问次数的时间段）  
        private const int RELEASE_INTERVAL = 5 * 60 * 1000; // 5 分钟（清除一个禁止IP的时间段） 

        private static Timer _Timer = CreateTimer();

        private static Timer _BannedTimer = CreateBanningTimer();

        private void context_BeginRequest(object sender, EventArgs e)
        {
            string ip = HttpContext.Current.Request.UserHostAddress;
            if (Banned.Contains(ip))
            {
                HttpContext.Current.Response.StatusCode = 403;
                //HttpContext.Current.Response.Write("你在有限的时间内，访问次数过多，请检查");
                HttpContext.Current.Response.End();
            }

            CheckIpAddress(ip);
        }

        /// <summary>  
        /// 检查访问IP  
        /// </summary>  
        private static void CheckIpAddress(string ip)
        {
            if (!_IpAdresses.ContainsKey(ip)) //如果没有当前访问IP的记录就将访问次数设为1  
            {
                _IpAdresses[ip] = 1;
            }
            else if (_IpAdresses[ip] == BANNED_REQUESTS) //如果当前IP访问次数等于规定时间段的最大访问次数就拉于“黑名单”  
            {
                Banned.Push(ip);
                //保存到数据库
                SaveBlockIpToData(ip);

                _IpAdresses.Remove(ip);
            }
            else //正常访问就加次数 1  
            {
                _IpAdresses[ip]++;
            }
        }

        #region Timers

        /// <summary>  
        /// 创建计时器，从_IpAddress减去一个请求。  
        /// </summary>  
        private static Timer CreateTimer()
        {
            Timer timer = GetTimer(REDUCTION_INTERVAL);
            timer.Elapsed += new ElapsedEventHandler(TimerElapsed);
            return timer;
        }

        /// <summary>  
        /// 创建定时器，消除一个禁止的IP地址  
        /// </summary>  
        /// <returns></returns>  
        private static Timer CreateBanningTimer()
        {
            Timer timer = GetTimer(RELEASE_INTERVAL);
            timer.Elapsed += delegate { Banned.Pop(); }; //消除一个禁止IP  
            return timer;
        }

        /// <summary>  
        /// 创建一个时间器，并启动它  
        /// </summary>  
        /// <param name="interval">以毫秒为单位的时间间隔</param>  
        private static Timer GetTimer(int interval)
        {
            Timer timer = new Timer();
            timer.Interval = interval;
            timer.Start();

            return timer;
        }

        /// <summary>  
        /// 减去从集合中的每个IP地址的请求  
        /// </summary>  
        private static void TimerElapsed(object sender, ElapsedEventArgs e)
        {
            //foreach (string key in _IpAdresses.Keys)
            //{
            //    _IpAdresses[key]--;
            //    //if (_IpAdresses[key] == 0)
            //        //_IpAdresses.Remove(key);
            //}
        }

        private static void SaveBlockIpToData(string ip)
        {
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = "/api/blockedip";
            BlockedIP blockedIp=new BlockedIP();
            blockedIp.BlockIP = ip;
            blockedIp.ID = Guid.NewGuid();
            blockedIp.Created = DateTime.Now;

            httpRequestBody.requestParameters = JsonConvert.SerializeObject(blockedIp);

            IRestResponse response = DoPostOrPut(httpRequestBody, Method.POST);
            //将返回值转换为Json对象
            object returnValue = JsonConvert.DeserializeObject(response.Content);
        }

        private static IRestResponse DoPostOrPut(HttpRequestBody httpRequestBody, Method httpMethod)
        {
            RestClient restClient = new RestClient(backendServiceEndPoint + httpRequestBody.requestUri);
            restClient.AddDefaultHeader("content-type", "application/json");
            restClient.AddDefaultHeader("accept", "application/json");
            restClient.AddDefaultHeader("ClientType", "PC");
            var request = new RestRequest(httpMethod);
            request.RequestFormat = DataFormat.Json;
            //所有的请求都需要将Token加到Header中            
            request.AddHeader("Authorization", "bearer 001");

            //对前台传入的Json字符串反序列化为实体
            System.Web.Script.Serialization.JavaScriptSerializer jsonSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            object objJson = jsonSerializer.Deserialize<object>(httpRequestBody.requestParameters.ToString());
            //AddJsonBody此方法会对参数进行序列化操作，所以必须传入一个实体对象。
            request.AddJsonBody(objJson);

            return restClient.Execute(request);
        }

        /// <summary>
        /// 保存黑名单数据进入application
        /// </summary>
        private static List<BlockedIP>  GetBlockedIps()
        {
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = "/api/blockedips";
            BlockedIP blockedIp = new BlockedIP();
            blockedIp.BlockIP = "127.0.0.1";
            blockedIp.ID = Guid.NewGuid();
            blockedIp.Created = DateTime.Now;

            httpRequestBody.requestParameters = JsonConvert.SerializeObject(blockedIp);

            IRestResponse response = DoGetOrDelete(httpRequestBody, Method.GET);
            //将返回值转换为Json对象
            List<BlockedIP> returnValue = JsonConvert.DeserializeObject<List<BlockedIP>>(response.Content);
            return returnValue;
        }
        private static IRestResponse DoGetOrDelete(HttpRequestBody httpRequestBody, Method httpMethod)
        {
            string backendServiceEndPoint = ConfigurationManager.AppSettings["BackendServiceEndPoint"];
            RestClient restClient = new RestClient(backendServiceEndPoint + httpRequestBody.requestUri);
            restClient.AddDefaultHeader("content-type", "application/json");
            restClient.AddDefaultHeader("accept", "application/json");
            restClient.AddDefaultHeader("ClientType", "PC");
            var request = new RestRequest(httpMethod);

            //所有的请求都需要将Token加到Header中            
            request.AddHeader("Authorization", "bearer 002");

            return restClient.Execute(request);
        }
        #endregion
    }

    public class BlockedIP
    {
        public System.Guid ID { get; set; }
        public string BlockIP { get; set; }
        public Nullable<System.DateTime> Created { get; set; }
    }
}