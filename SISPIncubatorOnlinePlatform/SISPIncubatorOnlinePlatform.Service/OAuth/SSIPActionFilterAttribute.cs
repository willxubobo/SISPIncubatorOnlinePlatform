using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Security;

namespace SISPIncubatorOnlinePlatform.Service.OAuth
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class SSIPActionFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            string actionName = actionContext.ActionDescriptor.ActionName;
            string controllerName = actionContext.ControllerContext.ControllerDescriptor.ControllerName;

            if (new FunctionsManager().UserHasPermission(controllerName, actionName))
            {
                base.OnActionExecuting(actionContext);
                return;
            }
            else
            {
                throw new ForbiddenException("当前操作被拒绝！");
            }
        }
    }
}