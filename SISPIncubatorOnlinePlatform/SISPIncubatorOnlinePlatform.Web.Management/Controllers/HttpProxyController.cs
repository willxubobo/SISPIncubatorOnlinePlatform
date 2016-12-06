﻿using Newtonsoft.Json;
using RestSharp;
using SISPIncubatorOnlinePlatform.Web.Management.CustomAttributes;
using SISPIncubatorOnlinePlatform.Web.Management.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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

namespace SISPIncubatorOnlinePlatform.Web.Management.Controllers
{
    [DeflateCompression]
    [RoutePrefix("api/proxy")]
    public class HttpProxyController : ApiController
    {
        private readonly static string backendServiceEndPoint = ConfigurationManager.AppSettings["BackendServiceEndPoint"];
        private readonly static string fileUploadFolder = ConfigurationManager.AppSettings["FileUploadFolder"];

        private string RequestToken
        {
            set { HttpContext.Current.Session["UserRequestToken"] = value; }
            get { return HttpContext.Current.Session["UserRequestToken"] as string; }
        }

        private User CurrentUser
        {
            set { HttpContext.Current.Session["CurrentUser"] = value; }
            get { return HttpContext.Current.Session["CurrentUser"] as User; }
        }

        /// <summary>
        /// 这个方法供登录时候验证用户名、密码使用
        /// </summary>
        /// <param name="requestBody">
        ///     @phone: 传入登录的手机号码
        ///     @password：传入密码
        /// </param>
        /// <returns>返回该用户的相关基本信息</returns>
        [HttpPost]
        [Route("auth")]
        public IHttpActionResult Authenticate(IDictionary<string, string> httpRequestBody)
        {
            if (httpRequestBody == null || httpRequestBody.Count == 0 || string.IsNullOrEmpty(httpRequestBody["mobile"].Trim()) || string.IsNullOrEmpty(httpRequestBody["password"].Trim()))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "请输入手机号或密码！");
            }

            string authUri = ConfigurationManager.AppSettings["AuthUri"];

            RestClient restClient = new RestClient(backendServiceEndPoint + authUri);
            restClient.AddDefaultHeader("accept", "application/json");
            restClient.AddDefaultHeader("ClientType", "PC");

            var request = new RestRequest(Method.POST);
            request.RequestFormat = DataFormat.Json;

            string encodedBody = string.Format("grant_type=password&username={0}&password={1}&scope={2}", httpRequestBody["mobile"].Trim(), httpRequestBody["password"],"manage");
            request.AddParameter("application/x-www-form-urlencoded", encodedBody, ParameterType.RequestBody);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");

            IRestResponse response = restClient.Execute(request);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            ResponseContentError responseContentError = serializer.Deserialize<ResponseContentError>(response.Content);
            if (responseContentError != null && responseContentError.Error!=null)
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, responseContentError.Error_Description);
            }
            AuthToken authToken = serializer.Deserialize<AuthToken>(response.Content);
            if (string.IsNullOrEmpty(authToken.Access_Token))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "手机号或密码错误！");
            }

            RequestToken = authToken.Access_Token;
            User user = new User().ConvertUser(authToken);
            CurrentUser = user;

            return Ok(user);
        }

        /// <summary>
        /// 这个方法供所有POST请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri
        /// @httpRequestBody.requestParameters 对应前端传入的JSON对象，请务必确保传入的JSON字符串是和后端API中接收的对象格式一致
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("post")]
        public IHttpActionResult PostProxy(HttpRequestBody httpRequestBody)
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

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
        /// 这个方法供所有PUT请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri
        /// @httpRequestBody.requestParameters 对应前端传入的JSON对象，请务必确保传入的JSON字符串是和后端API中接收的对象格式一致
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("put")]
        public IHttpActionResult PutProxy(HttpRequestBody httpRequestBody)
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

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
        /// 这个方法供所有GET请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri，Uri中需要包含对象Id的信息
        /// @httpRequestBody.requestParameters 做GET查询时，没有RequestBody的参数，可以放null值
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("get")]
        public IHttpActionResult GetProxy(HttpRequestBody httpRequestBody)
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

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


        /// <summary>
        /// 这个方法供所有SEARCH请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri
        /// @httpRequestBody.requestParameters 对应前端传入的JSON对象，请务必确保传入的JSON字符串是和后端API中接收的对象格式一致
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("search")]
        public IHttpActionResult SearchProxy(HttpRequestBody httpRequestBody)
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

            //这里不需要check requestParameters参数，因为Search的时候，可以不传入任何参数
            if (httpRequestBody == null || string.IsNullOrEmpty(httpRequestBody.requestUri))
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
        /// 这个方法供所有DELETE请求使用
        /// </summary>
        /// <param name="httpRequestBody">
        /// @httpRequestBody.requestUri 对应后端Service API的真实Uri，Uri中需要包含对象Id的信息
        /// @httpRequestBody.requestParameters 做DELETE时，没有RequestBody的参数，可以放null值
        /// </param>
        /// <returns>请求返回对象对应的JSON字符串</returns>
        [HttpPost]
        [Route("delete")]
        public IHttpActionResult DeleteProxy(HttpRequestBody httpRequestBody)
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

            if (httpRequestBody == null || string.IsNullOrEmpty(httpRequestBody.requestUri))
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "参数不能为空！");
            }

            IRestResponse response = DoGetOrDelete(httpRequestBody, Method.DELETE);

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

        [HttpPost]
        [Route("upload")]
        public IHttpActionResult UploadFile()
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                return HandleErrorMessage(HttpStatusCode.UnsupportedMediaType, "请上传文件！");
            }

            string filePath = HttpContext.Current.Server.MapPath(fileUploadFolder);
            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            var provider = new MultipartFormDataStreamProvider(filePath);

            try
            {
                // Read the file data.
                Request.Content.ReadAsMultipartAsync(provider);

                return Ok();
            }
            catch (System.Exception ex)
            {
                return HandleErrorMessage(HttpStatusCode.BadRequest, "上传失败！");
            }
        }


        [HttpPost]
        [Route("logout")]
        public void LogOut()
        {
            RequestToken = null;
            CurrentUser = null;
        }

        [HttpGet]
        [Route("currentuser")]
        public User GetCurrentUser()
        {
            return CurrentUser;
        }

        [HttpPut]
        [Route("user/refresh")]
        public IHttpActionResult RefreshCurrentUser()
        {
            //该用户还没有登录，或者Session已经失效，需要重新登录
            if (string.IsNullOrEmpty(RequestToken))
            {
                return HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

            if (CurrentUser == null)
            {
                HandleErrorMessage(HttpStatusCode.Unauthorized, "当前用户没有登录！");
            }

            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = string.Format("api/user/{0}", CurrentUser.Mobile);

            IRestResponse response = DoGetOrDelete(httpRequestBody, Method.GET);

            //后端API报错，将错误信息返回前端
            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return HandleErrorMessage(response.StatusCode, response.Content);
            }

            //将返回值转换为Json对象
            AuthToken authToken = JsonConvert.DeserializeObject<AuthToken>(response.Content);

            User user = new User().ConvertUser(authToken);
            CurrentUser = user;

            return Ok("ok");
        }

        private IRestResponse DoPostOrPut(HttpRequestBody httpRequestBody, Method httpMethod)
        {
            RestClient restClient = new RestClient(backendServiceEndPoint + httpRequestBody.requestUri);
            restClient.AddDefaultHeader("content-type", "application/json");
            restClient.AddDefaultHeader("accept", "application/json");
            restClient.AddDefaultHeader("ClientType", "PC");
            var request = new RestRequest(httpMethod);
            request.RequestFormat = DataFormat.Json;

            if (HttpContext.Current.Request.Files.Count > 0)
            {
                for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                {
                    HttpPostedFile uploadFile = HttpContext.Current.Request.Files[i];
                    long length = uploadFile.InputStream.Length;
                    byte[] buffer = new byte[length];
                    uploadFile.InputStream.Read(buffer, 0, (int)length);
                    request.AddFileBytes(uploadFile.FileName, buffer, uploadFile.FileName);
                }
                NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
                if (!string.IsNullOrEmpty(nvc.Get("SavePath")))
                {
                    Parameter p = new Parameter();
                    p.Name = "SavePath";
                    p.Value = nvc.Get("SavePath");
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("FileExtension")))
                {
                    Parameter p = new Parameter();
                    p.Name = "FileExtension";
                    p.Value = nvc.Get("FileExtension");
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("LogoSize")))
                {
                    Parameter p = new Parameter();
                    p.Name = "LogoSize";
                    p.Value = nvc.Get("LogoSize");
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("LogoRadio")))
                {
                    Parameter p = new Parameter();
                    p.Name = "LogoRadio";
                    p.Value = nvc.Get("LogoRadio");
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("IncubatorApplyId")))
                {
                    Parameter p = new Parameter();
                    p.Name = "IncubatorApplyId";
                    p.Value = nvc.Get("IncubatorApplyId");
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("DeleteIds")))
                {
                    Parameter p = new Parameter();
                    p.Name = "DeleteIds";
                    p.Value = nvc.Get("DeleteIds");
                    request.Parameters.Add(p);
                }
                //advertisement start
                if (!string.IsNullOrEmpty(nvc.Get("AdDescription")))
                {
                    Parameter p = new Parameter();
                    p.Name = "AdDescription";
                    p.Value = Utility.StringToUnicode(nvc.Get("AdDescription"));
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("AdInternertUrl")))
                {
                    Parameter p = new Parameter();
                    p.Name = "AdInternertUrl";
                    p.Value = Utility.StringToUnicode(nvc.Get("AdInternertUrl"));
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("AdSort")))
                {
                    Parameter p = new Parameter();
                    p.Name = "AdSort";
                    p.Value = Utility.StringToUnicode(nvc.Get("AdSort"));
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("AdIsShow")))
                {
                    Parameter p = new Parameter();
                    p.Name = "AdIsShow";
                    p.Value = Utility.StringToUnicode(nvc.Get("AdIsShow"));
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("AdModule")))
                {
                    Parameter p = new Parameter();
                    p.Name = "AdModule";
                    p.Value = Utility.StringToUnicode(nvc.Get("AdModule"));
                    request.AddParameter(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("AdIsEffective")))
                {
                    Parameter p = new Parameter();
                    p.Name = "AdIsEffective";
                    p.Value = Utility.StringToUnicode(nvc.Get("AdIsEffective"));
                    request.AddParameter(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("UserID")))
                {
                    Parameter p = new Parameter();
                    p.Name = "UserID";
                    p.Value = nvc.Get("UserID");
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("ComName")))
                {
                    Parameter p = new Parameter();
                    p.Name = "ComName";
                    p.Value = Utility.StringToUnicode(nvc.Get("ComName"));
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("ComDesc")))
                {
                    Parameter p = new Parameter();
                    p.Name = "ComDesc";
                    p.Value = Utility.StringToUnicode(nvc.Get("ComDesc"));
                    request.Parameters.Add(p);
                }
                if (!string.IsNullOrEmpty(nvc.Get("IsAdminAddCom")))
                {
                    Parameter p = new Parameter();
                    p.Name = "IsAdminAddCom";
                    p.Value = nvc.Get("IsAdminAddCom");
                    request.Parameters.Add(p);
                }
                //advertisement start
            }

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
            restClient.AddDefaultHeader("ClientType", "PC");
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
        [HttpPost]
        [Route("user/ufile")]
        public IHttpActionResult UploadUserLogo()
        {
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string imgPath = "";
            if (hfc.Count > 0)
            {
                NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
                HttpRequestBody httpRequestBody = new HttpRequestBody();
                httpRequestBody.requestUri = "/api/user/file";
                httpRequestBody.requestParameters = JsonConvert.SerializeObject(new UploadFileRequest(nvc.Get("SavePath")));
                return AnonymousPostProxy(httpRequestBody);
            }
            else
            {
                return Ok("nodata");
            }
        }

        [HttpPost]
        [Route("uploadregcompanyfile")]
        public IHttpActionResult UploadFileOfRegCompany()
        {
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string imgPath = "";
            NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = "/api/user/comfile";
            httpRequestBody.requestParameters = JsonConvert.SerializeObject(new UploadFileRequest(nvc.Get("UserID")));
            return AnonymousPostProxy(httpRequestBody);

        }

        [HttpPost]
        [Route("uploadaggreementfile")]
        public IHttpActionResult UploadFileOfAggreement()
        {
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string imgPath = "";
            NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = "/api/agreementattachment";
            httpRequestBody.requestParameters = JsonConvert.SerializeObject(new UploadFileRequest(nvc.Get("IncubatorApplyId")));
            return AnonymousPostProxy(httpRequestBody);

        }
        [HttpPost]
        [Route("uploadaggreementtempfile")]
        public IHttpActionResult UploadFileOfAggreementTemp()
        {
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string imgPath = "";
            NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = "/api/agreementtemplate";
            httpRequestBody.requestParameters = JsonConvert.SerializeObject(new UploadFileRequest(nvc.Get("IncubatorApplyId")));
            return AnonymousPostProxy(httpRequestBody);

        }
        [HttpPost]
        [Route("addAdvertisement")]
        public IHttpActionResult AddAdvertisement()
        {
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string imgPath = "";
            NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
            HttpRequestBody httpRequestBody = new HttpRequestBody();
            httpRequestBody.requestUri = "/api/advertisementandfile";
            httpRequestBody.requestParameters = JsonConvert.SerializeObject(new UploadFileRequest(nvc.Get("Description")));
            return AnonymousPostProxy(httpRequestBody);

        }
    }
}