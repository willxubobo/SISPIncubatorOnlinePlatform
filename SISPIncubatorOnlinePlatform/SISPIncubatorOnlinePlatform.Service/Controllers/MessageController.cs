using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Interfaces;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class MessageController : BaseController, IMessage
    {
        private readonly MessageManager _messageManager = new MessageManager();

        [Authorize]
        [HttpPost]
        [Route("message")]
        public IHttpActionResult CreateMessage(MessageCreateRequest messageDto)
        {
            return Ok(_messageManager.CreateMessage(messageDto));
        }

        [Authorize]
        [HttpGet]
        [Route("message/{id:Guid}")]
        public IHttpActionResult GetMessage(Guid id)
        {
            return Ok(_messageManager.GetMessageByGuid(id));
        }
        
        [AllowAnonymous]
        [HttpPost]
        [Route("messages")]
        public IHttpActionResult GetMessages(MessageRequest conditions)
        {
            return Ok(_messageManager.GetAll(conditions));
        }

        [Authorize]
        [HttpPost]
        [SSIPActionFilter]
        [Route("messages/admin")]
        public IHttpActionResult DeleteMessages(MessageDeleteRequest messageDeleteRequest)
        {
            _messageManager.DeleteMsgByIds(messageDeleteRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("messages/sendto")]
        public IHttpActionResult GetSendToMessages(MessageRequest conditions)
        {
            return Ok(_messageManager.GetSendToAll(conditions));
        }

        [Authorize]
        [HttpPost]
        [Route("messages/sendfrom")]
        public IHttpActionResult GetSendFromMessages(MessageRequest conditions)
        {
            return Ok(_messageManager.GetSendFromAll(conditions));
        }
        [Authorize]
        [HttpPost]
        [Route("message/count")]
        public IHttpActionResult GetMessageCount(MessageRequest conditions)
        {
            return Ok(_messageManager.GetMessageCount(conditions));
        }

        [Authorize]
        [HttpDelete]
        [Route("message/{id:Guid}")]
        public IHttpActionResult DeleteMessage(Guid id)
        {
            _messageManager.DeleteMessage(id);
            return Ok();
        }

        [HttpDelete]
        [Route("message/allsys")]
        public IHttpActionResult DeleteAllSysMessage()
        {
            string type = SISPIncubatorOnlineEnum.MessageType.SystemMsg.GetHashCode().ToString();
            _messageManager.DeleteAllMsg(type);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("message/allsys")]
        public IHttpActionResult UpdateAllSysMessage(MessageCreateRequest messageRequest)
        {
            string type = SISPIncubatorOnlineEnum.MessageType.SystemMsg.GetHashCode().ToString();
            _messageManager.UpdateAllMsg(type,messageRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("message/allperson")]
        public IHttpActionResult DeleteAllPersonMessage(MessageRequest messageRequest)
        {
            _messageManager.DeleteChartMsg(messageRequest);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("message/uallperson")]
        public IHttpActionResult UpdateAllPersonMessage(MessageRequest messageRequest)
        {
            _messageManager.UpdateChartMsg(messageRequest);
            return Ok();
        }
    }
}
