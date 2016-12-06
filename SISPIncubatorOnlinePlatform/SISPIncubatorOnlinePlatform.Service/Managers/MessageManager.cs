using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    /// <summary>
    ///消息管理
    /// </summary>
    public class MessageManager : BaseManager
    {

        public MessageResponse GetMessageByGuid(Guid id)
        {
            MessageResponse messageResponse = new MessageResponse();
            UserManager userManager = null;
            List<Message> messages =
                SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(x => x.MessageID == id).ToList();
            List<MessageDTO> dtoList = new List<MessageDTO>();

            foreach (Message message in messages)
            {
                message.Status = SISPIncubatorOnlineEnum.MessageStatus.Read.GetHashCode().ToString();
                userManager = new UserManager();
                MessageDTO messageDto = new MessageDTO();
                messageDto.Content = message.Content;
                messageDto.Title = message.Title;
                messageDto.SendTo = message.SendTo;
                messageDto.SendFrom = message.SendFrom;
                User user = userManager.GetUserById(messageDto.SendTo);
                if (user != null)
                {
                    messageDto.SendToUserName = user.UserName;
                }
                user = userManager.GetUserById(messageDto.SendFrom);
                if (user != null)
                {
                    messageDto.SendFromUserName = user.UserName;
                }
                messageDto.Created = message.Created.ToString("yyyy-MM-dd HH:mm");
                messageDto.MsgType = message.MsgType;
                messageDto.Status = message.Status;
                messageDto.SessionID = message.SessionID;
                dtoList.Add(messageDto);
            }

            messageResponse.Results = dtoList;
            messageResponse.TotalCount = dtoList.Count;
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            return messageResponse;
        }

        public MessageResponse CreateMessage(MessageCreateRequest messageDto)
        {
            var messageResponse = new MessageResponse();
            if (messageDto != null)
            {
                User user = UserHelper.CurrentUser;
                var message = messageDto.Message;
                if (message != null)
                {
                    string msgType = message.MsgType;
                    message.Title = "消息";
                    message.SendFrom = user.UserID;
                    message.MessageID = Guid.NewGuid();
                    message.Created = DateTime.Now;
                    message.DeleteFlagR = false;
                    message.DeleteFlagS = false;
                    message.IsPop = false;
                    //默认是未读
                    message.Status = SISPIncubatorOnlineEnum.MessageStatus.Unread.GetHashCode().ToString();

                    if (!string.IsNullOrEmpty(msgType) &&
                        msgType == SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString())
                    {
                        string sessionId = Convert.ToString(message.SessionID);
                        //如果为空，开启会话
                        if (!string.IsNullOrEmpty(sessionId))
                        {
                            string sendToPhone = message.SendTo.ToString();
                            message.SessionID = Guid.NewGuid();
                            UserManager userManager = new UserManager();
                            User sendToUser = userManager.GetUserByMobile(sendToPhone);
                            if (sendToUser != null)
                            {
                                //message.Title = user.UserName + "与" + sendToUser.UserName + "的会话";
                            }

                        }

                    }

                    SISPIncubatorOnlinePlatformEntitiesInstance.Message.Add(message);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                    messageResponse.Id = message.MessageID;
                }

            }
            else
            {
                throw new BadRequestException("[MessageManager Method(CreateMessage): MessageCreateRequest is null]未获取到提交的活动信息！");
            }
            return messageResponse;
        }
        /// <summary>
        /// 创建系统消息
        /// </summary>
        /// <param name="sendto"></param>
        /// <param name="content"></param>
        public void CreateSystemMessage(string sendto, string content)
        {
            Message message = new Message();
            User user = UserHelper.CurrentUser;

            message.Title = "系统消息";
            message.SendFrom = user.UserID;
            if (!string.IsNullOrEmpty(sendto))
            {
                message.SendTo = new Guid(sendto);
            }
            message.MessageID = Guid.NewGuid();
            message.Created = DateTime.Now;
            message.DeleteFlagR = false;
            message.DeleteFlagS = false;
            message.IsPop = false;
            message.Content = content;
            //默认是未读
            message.Status = SISPIncubatorOnlineEnum.MessageStatus.Unread.GetHashCode().ToString();
            message.MsgType = SISPIncubatorOnlineEnum.MessageType.SystemMsg.GetHashCode().ToString();
            SISPIncubatorOnlinePlatformEntitiesInstance.Message.Add(message);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }
        public void UpdateMessage(MessageUpdateRequest messageDto)
        {
            if (messageDto != null)
            {

                var message =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Message.FirstOrDefault(
                        x => x.MessageID == messageDto.Message.MessageID);
                if (message != null)
                {
                    MessageDTOToMessage(messageDto.Message,
                        message);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    throw new BadRequestException(
                   "[MessageManager Method(UpdateMessage): Message is null]未查询到系统信息！");
                }
            }
            else
            {
                throw new BadRequestException(
                    "[MessageManager Method(UpdateMessage): MessageUpdateRequest is null]未查询到系统信息！");
            }
        }

        public void DeleteMessage(Guid id)
        {
            var message = SISPIncubatorOnlinePlatformEntitiesInstance.Message.FirstOrDefault(x => x.MessageID == id);
            if (message != null)
            {
                string type = message.MsgType;
                User user = UserHelper.CurrentUser;

                if (type == SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString())
                {
                    Guid sendToGuid = message.SendTo;
                    Guid sendFromGuid = message.SendFrom;
                    //我发送的
                    if (Convert.ToString(user.UserID) == Convert.ToString(sendFromGuid))
                    {
                        message.DeleteFlagS = true;
                    }
                    //我接收
                    if (Convert.ToString(user.UserID) == Convert.ToString(sendToGuid))
                    {
                        message.DeleteFlagR = true;
                    }
                }
                else
                {
                    SISPIncubatorOnlinePlatformEntitiesInstance.Message.Remove(message);
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[MessageManager Method(DeleteMessage): Message is null id=" + id + "]未查询到系统信息！");
            }
        }

        /// <summary>
        /// 根据查询条件查询需求发布表
        /// </summary>
        /// <param name="conditions">多条件</param>
        /// <returns></returns>
        public MessageResponse GetAll(MessageRequest conditions)
        {
            MessageResponse messageResponse = new MessageResponse();
            List<Message> messages = new List<Message>();
            UserManager userManager = null;
            int total = 0;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string msgType = conditions.MsgType;


                if (msgType == SISPIncubatorOnlineEnum.MessageType.SystemMsg.GetHashCode().ToString())
                {
                    User user = UserHelper.CurrentUser;
                    total =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                            p => p.MsgType == msgType && p.SendTo == user.UserID)
                            .OrderByDescending(p => p.Created).ToList().Count;
                    messages =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                            p => p.MsgType == msgType && p.SendTo == user.UserID)
                            .OrderByDescending(p => p.Created)
                            .Skip(pageSize * pageIndex)
                            .Take(pageSize).ToList();
                }
                else if (msgType == "pop")
                {

                    DateTime ds = DateTime.Now.AddDays(-2);
                    //用户没有登陆，不需要报错，抛异常
                    User user = GetUser();
                    if (user != null)
                    {
                        messages =
                            SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                                p =>
                                    p.SendTo == user.UserID && p.IsPop == false && p.Created >= ds &&
                                    p.DeleteFlagR == false && p.DeleteFlagS == false)
                                .OrderByDescending(p => p.Created)
                                .Take(1)
                                .ToList();
                        UpdateMsgPop(messages);
                    }

                }
                else
                {
                    List<Message> listTmp = SISPIncubatorOnlinePlatformEntitiesInstance.Message.OrderByDescending(p => p.Created).ToList();
                    total = listTmp.Count;
                    messages = listTmp.Skip(pageSize * pageIndex)
                            .Take(pageSize).ToList();
                }
            }
            else
            {
                messages =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Message.OrderBy(p => p.Created).ToList();
                total = messages.Count;
            }
            List<MessageDTO> dtoList = new List<MessageDTO>();

            foreach (Message message in messages)
            {
                message.Status = message.Status;
                userManager = new UserManager();
                MessageDTO messageDto = new MessageDTO();
                messageDto.MessageID = message.MessageID;
                messageDto.Content = message.Content;
                messageDto.Title = message.Title;
                messageDto.SendTo = message.SendTo;
                messageDto.SendFrom = message.SendFrom;
                User user = userManager.GetUserById(messageDto.SendTo);
                if (user != null)
                {
                    messageDto.SendToUserName = user.UserName;
                }
                user = userManager.GetUserById(messageDto.SendFrom);
                if (user != null)
                {
                    messageDto.SendFromUserName = user.UserName;
                }
                messageDto.Created = message.Created.ToString("yyyy-MM-dd HH:mm");
                messageDto.MsgType = message.MsgType;
                messageDto.Status = message.Status;
                messageDto.SessionID = message.SessionID;
                dtoList.Add(messageDto);
            }

            messageResponse.Results = dtoList;
            messageResponse.TotalCount = total;
            return messageResponse;
        }
        /// <summary>
        /// 获取发送给当前用户的信息
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public MessageResponseChartDTO GetSendToAll(MessageRequest conditions)
        {
            List<MessageChartDTO> listChartDtos = new List<MessageChartDTO>();
            int total = 0;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string msgType = conditions.MsgType;
                User users = UserHelper.CurrentUser;
                UserManager userManager = new UserManager(); ;

                if (msgType == SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString())
                {
                    total = SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                        p => p.MsgType == msgType && p.SendTo == users.UserID && p.DeleteFlagR == false)
                        .OrderByDescending(p => p.Created).ToList().Count;

                    List<Message> listMsgs =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                            p => p.MsgType == msgType && p.SendTo == users.UserID && p.DeleteFlagR == false)
                            .OrderByDescending(p => p.Created)
                            .Skip(pageSize * pageIndex)
                            .Take(pageSize).ToList();
                    foreach (Message message in listMsgs)
                    {
                        MessageChartDTO messageChartDto = new MessageChartDTO();
                        messageChartDto.Content = message.Content;
                        messageChartDto.Title = message.Content;
                        messageChartDto.Status = message.Status;
                        messageChartDto.MessageID = message.MessageID;
                        messageChartDto.SendTo = message.SendTo;
                        messageChartDto.SendFrom = message.SendFrom;
                        messageChartDto.Created = message.Created.ToString("yyyy-MM-dd HH:mm");
                        WeChat webChat =
                            SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.FirstOrDefault(
                                p => p.UserID == message.SendFrom);
                        if (webChat != null)
                        {
                            messageChartDto.Headimgurl = webChat.Headimgurl;
                            if (!webChat.Headimgurl.Contains("http"))
                            {
                                var serviceUrl = Utility.GetServicesImageUrl();
                                messageChartDto.Headimgurl = serviceUrl + webChat.Headimgurl;
                            }
                        }

                        User user = userManager.GetUserById(messageChartDto.SendTo);
                        if (user != null)
                        {
                            messageChartDto.SendToUserName = user.UserName;
                        }
                        user = userManager.GetUserById(messageChartDto.SendFrom);
                        if (user != null)
                        {
                            messageChartDto.SendFromUserName = user.UserName;
                        }
                        listChartDtos.Add(messageChartDto);
                    }

                }
            }
            else
            {
                LoggerHelper.Error("[MessageManager Method(GetSendToAll): MessageRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[MessageManager Method(GetSendToAll): MessageRequest is null]未能正确获取查询条件！");
            }
            MessageResponseChartDTO messageResponseChartDto = new MessageResponseChartDTO();
            messageResponseChartDto.Results = listChartDtos;
            messageResponseChartDto.TotalCount = total;

            return messageResponseChartDto;
        }

        /// <summary>
        /// 获取所有当前用户发送的消息
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public MessageResponseChartDTO GetSendFromAll(MessageRequest conditions)
        {
            List<MessageChartDTO> listChartDtos = new List<MessageChartDTO>();
            int total = 0;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string msgType = conditions.MsgType;
                User users = UserHelper.CurrentUser;

                UserManager userManager = new UserManager(); ;

                if (msgType == SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString())
                {
                    total = SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                        p => p.MsgType == msgType && p.SendFrom == users.UserID && p.DeleteFlagS == false)
                        .OrderByDescending(p => p.Created).ToList().Count;

                    List<Message> listMsgs =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(
                            p => p.MsgType == msgType && p.SendFrom == users.UserID && p.DeleteFlagS == false)
                            .OrderByDescending(p => p.Created)
                            .Skip(pageSize * pageIndex)
                            .Take(pageSize).ToList();
                    foreach (Message message in listMsgs)
                    {
                        MessageChartDTO messageChartDto = new MessageChartDTO();
                        messageChartDto.Content = message.Content;
                        messageChartDto.Title = message.Content;
                        messageChartDto.Status = message.Status;
                        messageChartDto.MessageID = message.MessageID;
                        messageChartDto.SendTo = message.SendTo;
                        messageChartDto.SendFrom = message.SendFrom;
                        messageChartDto.Created = message.Created.ToString("yyyy-MM-dd HH:mm");
                        WeChat webChat =
                            SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.FirstOrDefault(
                                p => p.UserID == message.SendTo);
                        if (webChat != null)
                        {
                            messageChartDto.Headimgurl = webChat.Headimgurl;
                            if (!webChat.Headimgurl.Contains("http"))
                            {
                                var serviceUrl = Utility.GetServicesImageUrl();
                                messageChartDto.Headimgurl = serviceUrl + webChat.Headimgurl;
                            }
                        }
                        else
                        {
                            LoggerHelper.Error("[MessageManager Method(GetSendFromAll): webChat is null]！");
                            //throw new BadRequestException("[MessageManager Method(GetSendToAll): MessageRequest is null]未能正确获取查询条件！");
                        }

                        User user = userManager.GetUserById(messageChartDto.SendTo);
                        if (user != null)
                        {
                            messageChartDto.SendToUserName = user.UserName;
                        }
                        user = userManager.GetUserById(messageChartDto.SendFrom);
                        if (user != null)
                        {
                            messageChartDto.SendFromUserName = user.UserName;
                        }

                        listChartDtos.Add(messageChartDto);
                    }

                }
            }
            else
            {
                LoggerHelper.Error("[MessageManager Method(GetSendToAll): MessageRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[MessageManager Method(GetSendToAll): MessageRequest is null]未能正确获取查询条件！");
            }
            MessageResponseChartDTO messageResponseChartDto = new MessageResponseChartDTO();
            messageResponseChartDto.Results = listChartDtos;
            messageResponseChartDto.TotalCount = total;

            return messageResponseChartDto;
        }

        public int GetMessageCount(MessageRequest conditions)
        {
            List<Message> list =
                SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(p => p.SendTo == conditions.SendTo && p.Status == "0" && p.DeleteFlagR == false).ToList();
            return list.Count;
        }

        private void MessageDTOToMessage(Message messageDto, Message message)
        {
            message.Title = messageDto.Title;
            message.Content = messageDto.Content;
            message.SendFrom = messageDto.SendFrom;
            message.SendTo = messageDto.SendTo;
            message.Status = messageDto.Status;
            message.Created = messageDto.Created;
            message.DeleteFlagR = messageDto.DeleteFlagR;
            message.DeleteFlagS = messageDto.DeleteFlagS;
        }
        /// <summary>
        /// 批量更新系统消息为已读,
        /// </summary>
        public void UpdateAllMsg(string msgType, MessageCreateRequest messageRequest)
        {
            User user = UserHelper.CurrentUser;
            if (messageRequest != null)
            {
                List<Message> list = messageRequest.listMsgs;
                foreach (Message message in list)
                {
                    Guid guid = message.MessageID;
                    Message messageNew =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Message.FirstOrDefault(p => p.MessageID == guid && p.SendTo == user.UserID && p.MsgType == msgType);
                    if (messageNew != null)
                    {
                        messageNew.Status = SISPIncubatorOnlineEnum.MessageStatus.Read.GetHashCode().ToString();
                        SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                    }
                }

            }
            else
            {
                LoggerHelper.Error("[MessageManager Method(UpdateAllMsg): MessageRequest is null]参数有误");
                throw new BadRequestException("[MessageManager Method(UpdateAllMsg): MessageRequest is null]参数有误！");
            }
        }
        /// <summary>
        /// 批量更新我接受的消息为已读,
        /// </summary>
        public void UpdateSendToAllMsg(MessageRequest messageRequest)
        {
            User user = UserHelper.CurrentUser;
            string msgType = SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString();
            List<Message> list = messageRequest.listMsgs;
            foreach (Message message in list)
            {
                Guid guid = message.MessageID;
                Message messageNew =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Message.FirstOrDefault(p => p.MessageID == guid && p.SendTo == user.UserID && p.MsgType == msgType);
                if (messageNew != null)
                {
                    messageNew.Status = SISPIncubatorOnlineEnum.MessageStatus.Read.GetHashCode().ToString();
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
            }


        }
        /// <summary>
        /// 批量更新我发送的的消息为已读,
        /// </summary>
        //public void UpdateSendFromMsg()
        //{
        //    User user = UserHelper.CurrentUser;
        //    string sql = " update Message set status=@status where Sendfrom=@userid and msgType=@msgType";
        //    SqlParameter[] para = new SqlParameter[] 
        //    { 
        //            new SqlParameter("@status",SISPIncubatorOnlineEnum.MessageStatus.Read.GetHashCode().ToString()),
        //            new SqlParameter("@userid",user.UserID),
        //            new SqlParameter("@msgType",SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString()), 
        //     };

        //    if (string.IsNullOrEmpty(Convert.ToString(user.UserID)))
        //    {
        //        throw new BadRequestException("[MessageManager Method(DeleteAllMsg): user.UserID 为空]用户userId为空！");
        //    }
        //    else
        //    {
        //        SISPIncubatorOnlinePlatformEntitiesInstance.Database.ExecuteSqlCommand(sql, para);
        //    }

        //}
        /// <summary>
        /// 批量删除
        /// </summary>
        public void DeleteAllMsg(string msgType)
        {
            User user = UserHelper.CurrentUser;
            List<Message> list = SISPIncubatorOnlinePlatformEntitiesInstance.Message.Where(p => p.SendTo == user.UserID && p.MsgType == msgType).ToList();
            SISPIncubatorOnlinePlatformEntitiesInstance.Message.RemoveRange(list);
            if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
            {
                throw new BadRequestException("[MessageManager Method(DeleteAllMsg):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确删除数据！");
            }
        }

        /// <summary>
        /// 批量删除我发送的
        /// </summary>
        public void DeleteSendFromMsg()
        {
            User user = UserHelper.CurrentUser;
            string type = SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString();

            string sql = " update Message set DeleteFlagS=@DeleteFlagS where sendfrom=@userid  and msgType=@msgType";
            SqlParameter[] para = new SqlParameter[] 
            { 
                    new SqlParameter("@userid",SqlDbType.UniqueIdentifier),
                    new SqlParameter("@msgType",SqlDbType.NVarChar), 
                    new SqlParameter("@DeleteFlagS",SqlDbType.Bit,1),
             };
            para[0].Value = user.UserID;
            para[1].Value = type;
            para[2].Value = true;

            if (string.IsNullOrEmpty(Convert.ToString(user.UserID)))
            {
                throw new BadRequestException("[MessageManager Method(DeleteAllMsg): user.UserID 为空]用户userId为空！");
            }
            else
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.Database.ExecuteSqlCommand(sql, para);
            }
        }
        /// <summary>
        /// 批量删除我接收的
        /// </summary>
        public void DeleteSendToMsg()
        {
            User user = UserHelper.CurrentUser;
            string type = SISPIncubatorOnlineEnum.MessageType.ChartMsg.GetHashCode().ToString();

            string sql = " update Message set DeleteFlagR=@DeleteFlagR where SendTo=@userid  and msgType=@msgType";
            SqlParameter[] para = new SqlParameter[] 
            { 
                    new SqlParameter("@userid",SqlDbType.UniqueIdentifier),
                    new SqlParameter("@msgType",SqlDbType.NVarChar), 
                    new SqlParameter("@DeleteFlagR",SqlDbType.Bit,1),
             };
            para[0].Value = user.UserID;
            para[1].Value = type;
            para[2].Value = true;
            if (string.IsNullOrEmpty(Convert.ToString(user.UserID)))
            {
                throw new BadRequestException("[MessageManager Method(DeleteAllMsg): user.UserID 为空]用户userId为空！");
            }
            else
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.Database.ExecuteSqlCommand(sql, para);
            }
        }
        /// <summary>
        /// 批量删除个人消息状态
        /// </summary>
        /// <param name="messageRequest"></param>
        public void DeleteChartMsg(MessageRequest messageRequest)
        {
            if (messageRequest != null)
            {
                if (messageRequest.SendToOrFrom == "sendto")
                {
                    DeleteSendToMsg();
                }
                else
                {
                    DeleteSendFromMsg();
                }
            }
            else
            {
                throw new BadRequestException("[MessageManager Method(DeleteChartMsg):messageRequest is fail ]未能加载条件！");
            }
        }
        /// <summary>
        /// 批量更新个人消息状态
        /// </summary>
        /// <param name="messageRequest"></param>
        public void UpdateChartMsg(MessageRequest messageRequest)
        {
            if (messageRequest != null)
            {
                if (messageRequest.SendToOrFrom == "sendto")
                {
                    UpdateSendToAllMsg(messageRequest);
                }
                else
                {
                    //UpdateSendFromMsg();
                }
            }
            else
            {
                throw new BadRequestException("[MessageManager Method(UpdateChartMsg):messageRequest is fail ]未能加载条件！");
            }
        }

        public void DeleteMsgByIds(MessageDeleteRequest messageDeleteRequest)
        {
            if (messageDeleteRequest != null)
            {
                string ids = messageDeleteRequest.DeleteIds;
                if (ids != null)
                {
                    string[] idArray = ids.Split('|');
                    foreach (string a in idArray)
                    {
                        if (!string.IsNullOrEmpty(a))
                        {
                            DeleteMessage(new Guid(a));
                        }
                    }
                }
                else
                {
                    throw new BadRequestException("[MessageManager Method(DeleteMsgByIds):ids is null ]未能加载条件API 提供参数有误 ids is null！");
                }
            }
            else
            {
                throw new BadRequestException("[MessageManager Method(DeleteMsgByIds):MessageDeleteRequest is null ]未能加载条件API 提供参数有误！");
            }
        }
        /// <summary>
        /// 更新是否弹出
        /// </summary>
        /// <param name="messages"></param>
        public void UpdateMsgPop(List<Message> messages)
        {
            foreach (Message message in messages)
            {
                Message messagenew =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Message.FirstOrDefault(
                        p => p.MessageID == message.MessageID);
                messagenew.IsPop = true;
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        public User GetUser()
        {
            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity != null &&
                !string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
            {
                string userPhone = HttpContext.Current.User.Identity.Name;
                return new UserManager().GetUserByMobile(userPhone);
            }
            else
            {
                return null;
            }
        }
    }
}