using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IServicePublish
    {
        IHttpActionResult CreateServicePublish(ServicePublishCreateRequest servicePublishDto);
        IHttpActionResult GetServicePublish(Guid id);
        IHttpActionResult GetServicePublishs(ServicePublishRequest conditions);
        IHttpActionResult UpdateServicePublish(ServicePublishUpdateRequest servicePublishDto);
        IHttpActionResult DeleteServicePublish(Guid id);
        IHttpActionResult GetMyServicePublishs(ServicePublishRequest conditions);
    }
}
