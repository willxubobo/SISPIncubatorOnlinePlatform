using SISPIncubatorOnlinePlatform.Service.Models;
//using SISPIncubatorOnlinePlatform.Service.Transports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IInvestorInformation
    {
        IHttpActionResult CreateInvestorInformation(InvestorInformationCreateRequest investorInformationCreateRequest);
        IHttpActionResult GetInvestorInformation(Guid investorId);
        IHttpActionResult GetInvestorInformations(InvestorInformationRequest conditions);
        IHttpActionResult UpdateInvestorInformation(InvestorInformationCreateRequest investorInformationCreateRequest);
        IHttpActionResult DeleteInvestorInformation(Guid investorId);
    }
}
