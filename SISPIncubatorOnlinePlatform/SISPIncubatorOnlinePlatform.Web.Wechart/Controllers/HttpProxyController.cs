using Newtonsoft.Json;
using RestSharp;
using SISPIncubatorOnlinePlatform.Web.Wechart.CustomAttributes;
using SISPIncubatorOnlinePlatform.Web.Wechart.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Script.Serialization;
using System.Web.SessionState;

namespace SISPIncubatorOnlinePlatform.Web.Wechart.Controllers
{
    [DeflateCompression]
    [RoutePrefix("api/proxy")]
    public class HttpProxyController : ApiController, IRequiresSessionState
    {
        private readonly static string backendServiceEndPoint = ConfigurationManager.AppSettings["BackendServiceEndPoint"];
        private readonly static string fileUploadFolder = ConfigurationManager.AppSettings["FileUploadFolder"];

        private string RequestToken
        {
            set { HttpContext.Current.Session["UserRequestToken"] = value; }
            get { return HttpContext.Current.Session["UserRequestToken"] as string; }
        }
        /// <summary>
        /// 这个方法供所有匿名POST请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri
        /// @httpRequestBody.requestParameters 对应前端传入的JSON对象，请务必确保传入的JSON字符串是和后端API中接收的对象格式一致
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("post/anonymous")]
        public IHttpActionResult AnonymousPostProxy(HttpRequestBody httpRequestBody)
        {
            if (httpRequestBody == null || httpRequestBody.requestParameters == null || string.IsNullOrEmpty(httpRequestBody.requestUri))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "参数不能为空！");
            }

            IRestResponse response = DoPostOrPut(httpRequestBody, Method.POST);

            //后端API报错，将错误信息返回前端
            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return HandleErrorMessage(response.StatusCode, response.Content);
            }

            //将返回值转换为Json对象
            object returnValue = JsonConvert.DeserializeObject(response.Content);
            //请求成功后，将结果正常返回到前端
            return Ok(returnValue); 

        }

        /// <summary>
        /// 这个方法供所有匿名PUT请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri
        /// @httpRequestBody.requestParameters 对应前端传入的JSON对象，请务必确保传入的JSON字符串是和后端API中接收的对象格式一致
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("put/anonymous")]
        public IHttpActionResult AnonymousPutProxy(HttpRequestBody httpRequestBody)
        {
            if (httpRequestBody == null || httpRequestBody.requestParameters == null || string.IsNullOrEmpty(httpRequestBody.requestUri))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "参数不能为空！");
            }

            IRestResponse response = DoPostOrPut(httpRequestBody, Method.PUT);

            //后端API报错，将错误信息返回前端
            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return HandleErrorMessage(response.StatusCode, response.Content);
            }

            object returnValue = JsonConvert.DeserializeObject(response.Content);
            //请求成功后，将结果正常返回到前端
            return Ok(returnValue);
        }

        /// <summary>
        /// 这个方法供所有匿名PATCH请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri
        /// @httpRequestBody.requestParameters 对应前端传入的JSON对象，请务必确保传入的JSON字符串是和后端API中接收的对象格式一致
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPatch]
        [Route("patch/anonymous")]
        public IHttpActionResult AnonymousPatchProxy(HttpRequestBody httpRequestBody)
        {
            if (httpRequestBody == null || httpRequestBody.requestParameters == null || string.IsNullOrEmpty(httpRequestBody.requestUri))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "参数不能为空！");
            }

            IRestResponse response = DoPostOrPut(httpRequestBody, Method.PATCH);

            //后端API报错，将错误信息返回前端
            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return HandleErrorMessage(response.StatusCode, response.Content);
            }

            object returnValue = JsonConvert.DeserializeObject(response.Content);
            //请求成功后，将结果正常返回到前端
            return Ok(returnValue);
        }

        /// <summary>
        /// 这个方法供所有匿名GET请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri，Uri中需要包含对象Id的信息
        /// @httpRequestBody.requestParameters 做GET查询时，没有RequestBody的参数，可以放null值
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("get/anonymous")]
        public IHttpActionResult AnonymousGetProxy(HttpRequestBody httpRequestBody)
        {
            if (httpRequestBody == null || string.IsNullOrEmpty(httpRequestBody.requestUri))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "参数不能为空！");
            }

            IRestResponse response = DoGetOrDelete(httpRequestBody, Method.GET);

            //后端API报错，将错误信息返回前端
            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return HandleErrorMessage(response.StatusCode, response.Content);
            }

            //将返回值转换为Json对象
            object returnValue = JsonConvert.DeserializeObject(response.Content);
            //请求成功后，将结果正常返回到前端
            return Ok(returnValue);
        }

        private IRestResponse DoPostOrPut(HttpRequestBody httpRequestBody, Method httpMethod)
        {
            RestClient restClient = new RestClient(backendServiceEndPoint + httpRequestBody.requestUri);
            restClient.AddDefaultHeader("content-type", "application/json");
            restClient.AddDefaultHeader("accept", "application/json");
            restClient.AddDefaultHeader("ClientType", "WeChat");
            var request = new RestRequest(httpMethod);
            request.RequestFormat = DataFormat.Json;

            //所有的请求都需要将Token加到Header中            
            request.AddHeader("Authorization", "bearer " + RequestToken);

            //对前台传入的Json字符串反序列化为实体
            System.Web.Script.Serialization.JavaScriptSerializer jsonSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            object objJson = jsonSerializer.Deserialize<object>(httpRequestBody.requestParameters.ToString());
            //AddJsonBody此方法会对参数进行序列化操作，所以必须传入一个实体对象。
            request.AddJsonBody(objJson);

            return restClient.Execute(request);
        }

        private IRestResponse DoGetOrDelete(HttpRequestBody httpRequestBody, Method httpMethod)
        {
            RestClient restClient = new RestClient(backendServiceEndPoint + httpRequestBody.requestUri);
            restClient.AddDefaultHeader("content-type", "application/json");
            restClient.AddDefaultHeader("accept", "application/json");
            restClient.AddDefaultHeader("ClientType", "WeChat");
            var request = new RestRequest(httpMethod);

            //所有的请求都需要将Token加到Header中            
            request.AddHeader("Authorization", "bearer " + RequestToken);

            return restClient.Execute(request);
        }

        private IHttpActionResult HandleErrorMessage(HttpStatusCode httpStatusCode, string errorMessage)
        {
            //如果包含 { 字符，约定已经是后台传回来的JSON格式的错误消息
            string errorContent = errorMessage.IndexOf('{') < 0 ? JsonConvert.SerializeObject(new ResponseError(httpStatusCode.GetHashCode(), errorMessage)) : errorMessage;

            HttpResponseMessage httpResponseMessage = new HttpResponseMessage(httpStatusCode);
            httpResponseMessage.Content = new StringContent(errorContent, Encoding.UTF8);

            return new System.Web.Http.Results.ResponseMessageResult(httpResponseMessage);
        }

    }
}