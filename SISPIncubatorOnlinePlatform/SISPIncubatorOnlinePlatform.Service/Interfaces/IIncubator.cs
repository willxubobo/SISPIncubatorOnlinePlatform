using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IIncubator
    {
        IHttpActionResult GetIncubator(Guid incubatorId);
        IHttpActionResult GetIncubators(IncubatorRequest conditions);
        IHttpActionResult CreateIncubator(IncubatorInfoRequest incubatorDto);
        IHttpActionResult UpdateIncubator(IncubatorInfoRequest incubatorDto);
        IHttpActionResult DeleteIncubator(Guid incubatorId);
    }
}
