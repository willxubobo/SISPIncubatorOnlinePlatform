using System;
using System.Collections.Generic;
using SISPIncubatorOnlinePlatform.Service.Entities;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class MessageRequest : SearchRequest
    {
        public Nullable<System.Guid> SendTo { get; set; }
        public string Status { get; set; }

        public string MsgType { get; set; }

        public string SendToOrFrom { get; set; }

        public List<Message> listMsgs { get; set; } 
    }

    public class MessageCreateRequest
    {
        public Message Message { get; set; }

        public Message SessionId { get; set; }

        public List<Message> listMsgs { get; set; } 
    }

    public class MessageUpdateRequest
    {
        public Message Message { get; set; }
    }


    public class MessageDeleteRequest
    {
        public string DeleteIds { get; set; }
    }
}