using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IIncubatorApply
    {
        IHttpActionResult GetIncubatorApplies(IncubatorApplyRequest conditions);
        IHttpActionResult GetIncubatorApplyById(Guid applyId);
        IHttpActionResult CreateIncubatorApply(IncubatorApplyCreateRequest incubatorApplyCreateRequest);
        IHttpActionResult UpdateIncubatorApply(IncubatorApplyCreateRequest incubatorApplyCreateRequest);
        IHttpActionResult DeleteIncubatorApply(Guid applyId);
    }
}