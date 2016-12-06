using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IFinancingRequirements
    {
        IHttpActionResult CreateFinancingRequirements(FinancingRequirementsCreateRequest financingRequirementsCreateRequest);
        IHttpActionResult GetFinancingRequirement(Guid frId);
        IHttpActionResult GetFinancingRequirements(FinancingRequirementsRequest conditions);
        IHttpActionResult UpdateFinancingRequirement(FinancingRequirementsCreateRequest financingRequirementsCreateRequest);
        IHttpActionResult DeleteFinancingRequirement(Guid frId);
    }
}
