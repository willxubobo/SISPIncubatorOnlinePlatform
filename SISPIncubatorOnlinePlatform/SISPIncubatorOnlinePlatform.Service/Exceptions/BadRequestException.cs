using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Exceptions
{
    public class BadRequestException : HttpException
    {
        public static readonly int STATUS_CODE = 400;

        /**
         * Create a new exception with an errorCode message pattern, and an optional array of substitution variables
         * for the message pattern.
         *
         * The error message.
         */
        public BadRequestException(string message)
            : base(STATUS_CODE, message)
        { }

        public override string Message
        {
            get
            {
                return base.Message;
            }
        }
    }
}