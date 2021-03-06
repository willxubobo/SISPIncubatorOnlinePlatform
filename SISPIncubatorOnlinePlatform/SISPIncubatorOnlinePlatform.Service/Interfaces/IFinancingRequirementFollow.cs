﻿using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IFinancingRequirementFollow
    {
        IHttpActionResult CreateFinancingRequirementFollow(FinancingRequirementFollowCreateRequest financingRequirementFollowCreateRequest);
        IHttpActionResult UpdateFinancingRequirementFollow(FinancingRequirementFollowCreateRequest financingRequirementFollowCreateRequest);
        IHttpActionResult DeleteFinancingRequirementFollow(Guid followId);
    }
}
