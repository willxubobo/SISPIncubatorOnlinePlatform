using Newtonsoft.Json;
using SISPIncubatorOnlinePlatform.Service.Common;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Filters;

namespace SISPIncubatorOnlinePlatform.Service.Exceptions
{
    public class ExceptionHandlerAttribute : ExceptionFilterAttribute
    {
        /// <summary>
        /// 统一对调用异常信息进行处理，返回自定义的异常信息
        /// </summary>
        /// <param name="context">HTTP上下文对象</param>
        public override void OnException(HttpActionExecutedContext context)
        {
            //异常信息记录到Log中，系统中其他异常的地方都不需要再记log
            LoggerHelper.Error("The API threw some exception: " + context.Exception);

            //自定义异常的处理
            HttpException ex = context.Exception as HttpException;
            string message = null;

            if (ex != null)
            {
                message = ex.Message.Substring(ex.Message.IndexOf(']') + 1).Trim();

                HttpStatusCode httpStatusCode = (HttpStatusCode)Enum.Parse(typeof(HttpStatusCode), ex.GetHttpCode().ToString());
                string errorContent = JsonConvert.SerializeObject(new ResponseError(ex.GetHttpCode(), message));

                throw new HttpResponseException(new HttpResponseMessage(httpStatusCode)
                {
                    //封装处理异常信息，返回指定JSON对象
                    Content = new StringContent(errorContent),
                    ReasonPhrase = httpStatusCode.ToString()
                });
            }

            //数据库字段验证异常处理
            DbEntityValidationException vex = context.Exception as DbEntityValidationException;
            if (vex != null)
            {
                //获取到所有EntityFramework验证的数据库字段异常错误信息
                StringBuilder sb = new StringBuilder();
                foreach (DbEntityValidationResult result in vex.EntityValidationErrors)
                {
                    foreach (DbValidationError error in result.ValidationErrors)
                    {
                        sb.AppendLine(error.ErrorMessage);
                    }
                }

                LoggerHelper.Error("The API threw some exception: " + sb.ToString());

                string errorContent = JsonConvert.SerializeObject(new ResponseError(HttpStatusCode.BadRequest.GetHashCode(), sb.ToString()));
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    //封装处理异常信息，返回指定JSON对象
                    Content = new StringContent(errorContent),
                    ReasonPhrase = HttpStatusCode.BadRequest.ToString()
                });
            }

            UnauthorizedAccessException unauth = context.Exception as UnauthorizedAccessException;
            if (unauth != null)
            {
                message = unauth.Message.Substring(unauth.Message.IndexOf(']') + 1).Trim();
               
                string errorContent = JsonConvert.SerializeObject(new ResponseError(401, message));

                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    //封装处理异常信息，返回指定JSON对象
                    Content = new StringContent(errorContent),
                    ReasonPhrase = HttpStatusCode.Unauthorized.ToString()
                });
            }

            //一般异常的处理                
            message = context.Exception.Message;
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent(message),
                ReasonPhrase = "InternalServerError"
            });
        }
    }
}