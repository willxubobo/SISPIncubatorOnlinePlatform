using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Web.Wechart.Models
{
    public class ResponseError
    {
        public ResponseError(int httpStatusCode, string message)
        {
            this.HttpStatusCode = httpStatusCode;
            this.Message = message;
        }

        /// <summary>
        /// HTTP状态代码
        /// </summary>
        public int HttpStatusCode { get; set; }
        /// <summary>
        /// 如果不成功，返回的错误信息
        /// </summary>
        public string Message { get; set; }
    }
}