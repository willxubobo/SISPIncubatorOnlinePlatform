using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IOfficeApply
    {
        IHttpActionResult GetOfficeApplies(OfficeApplyRequest conditions);
        IHttpActionResult GetOfficeApplyById(Guid applyId);
        IHttpActionResult CreateOfficeApply(OfficeApplyCreateRequest officeApplyDto);
        IHttpActionResult UpdateOfficeApply(OfficeApplyCreateRequest officeApplyDto);
        IHttpActionResult DeleteOfficeApply(Guid applyId);
    }
}
