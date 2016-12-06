using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface ISuccessfulCase
    {
        IHttpActionResult CreateSuccessfulCase(SuccessfulCaseCreateRequest SuccessfulCaseCreateRequest);
        IHttpActionResult GetSuccessfulCase(Guid CaseID);
        IHttpActionResult GetSuccessfulCases(SuccessfulCaseRequest conditions);
        IHttpActionResult UpdateSuccessfulCase(SuccessfulCaseCreateRequest SuccessfulCaseCreateRequest);
        IHttpActionResult DeleteSuccessfulCase(Guid CaseID);
    }
}
