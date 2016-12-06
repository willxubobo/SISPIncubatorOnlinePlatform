using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace SISPIncubatorOnlinePlatform.Service.Interfaces
{
    public interface IMessage
    {
        //bool CreateMessage(MessageDTO messageDTO);
        IHttpActionResult GetMessage(Guid messageId);
        IHttpActionResult GetMessages(MessageRequest conditions);
        //bool UpdateMessage(MessageDTO messageDTO);
    }
}
