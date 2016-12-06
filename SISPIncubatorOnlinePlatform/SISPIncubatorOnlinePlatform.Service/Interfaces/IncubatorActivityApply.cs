using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IIncubatorActivityApply
    {
        IHttpActionResult CreateIncubatorActivityApply(IncubatorActivityApplyCreateRequest incubatorActivityApplyDto);
        IHttpActionResult GetIncubatorActivityApply(Guid id);
        IHttpActionResult GetIncubatorActivityApplys(IncubatorActivityApplyRequest conditions);
        IHttpActionResult UpdateIncubatorActivityApply(IncubatorActivityApplyUpdateRequest incubatorActivityApplyDto);
        IHttpActionResult DeleteIncubatorActivityApply(Guid id);
    }
}
