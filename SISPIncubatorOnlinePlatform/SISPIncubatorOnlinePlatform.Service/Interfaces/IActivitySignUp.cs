using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IActivitySignUp
    {
        IHttpActionResult CreateActivitySignUp(ActivitySignUpCreateRequest activitySignUpDto);
        IHttpActionResult GetActivitySignUp(Guid id);
        IHttpActionResult GetActivitySignUps(ActivitySignUpRequest conditions);
        IHttpActionResult UpdateActivitySignUp(ActivitySignUpUpdateRequest activitySignUpDto);
        IHttpActionResult DeleteActivitySignUp(Guid id);
        IHttpActionResult GetMyActivity(MyActivityRequest conditions);
    }
}