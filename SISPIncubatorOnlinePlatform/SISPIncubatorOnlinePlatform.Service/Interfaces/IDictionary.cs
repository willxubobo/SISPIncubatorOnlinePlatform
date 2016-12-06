using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IDictionary
    {
        IHttpActionResult GetInfomations(DictionaryRequest conditions);
        IHttpActionResult GetInfomationByID(Guid applyID);
        IHttpActionResult CreateInfomation(DictionaryCreateRequest dictionaryCreateRequest);
        IHttpActionResult UpdateInfomation(DictionaryCreateRequest dictionaryCreateRequest);
        IHttpActionResult DeleteInfomation(Guid applyID);
    }
}
