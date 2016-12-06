using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IApproveRecord
    {
        //bool CreateApproveRecord(ApproveRecordDTO approveRecordDTO);
        //IHttpActionResult GetApproveRecord(Guid recordId);
        IHttpActionResult GetApproveRecords(ApproveRecordRequest conditions);
        IHttpActionResult GetMyApply(ApproveRecordRequest conditions);
        //bool UpdateApproveRecord(ApproveRecordDTO approveRecordDTO);
        //bool DeleteApproveRecord(Guid recordId);
    }
}
