using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class ActivityPublishApplyManager : BaseManager
    {
        /// <summary>
        /// 根据id获取活动申请列表
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        public ActivityPublishApplyResponse GetActivityPublishApplyByGuid(Guid id)
        {
            ActivityPublishApplyResponse activityPublishApplyResponse = new ActivityPublishApplyResponse();
            var activityPublishApply =
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.ActivityID == id).ToList();
            List<ActivityPublishApplyDTO> dtoList = new List<ActivityPublishApplyDTO>();
            Utility.CopyList<ActivityPublishApply, ActivityPublishApplyDTO>(activityPublishApply, dtoList);
            activityPublishApplyResponse.Results = dtoList;
            return activityPublishApplyResponse;
        }

        /// <summary>
        /// 创建活动申请列表
        /// </summary>
        /// <param name="activityPublishApplyDto"></param>
        /// <returns></returns>
        public ActivityPublishApplyResponse CreateActivityPublishApply(ActivityPublishApplyCreateRequest activityPublishApplyDto)
        {
            var activityPublishApplyResponse = new ActivityPublishApplyResponse();
            if (activityPublishApplyDto != null)
            {
                User user = UserHelper.CurrentUser;
                var activityPublishApply = activityPublishApplyDto.ActivityPublishApply;
                activityPublishApply.CreatedBy = user.UserID;
                var activityId = Guid.NewGuid();
                activityPublishApply.ActivityID = activityId;
                activityPublishApply.Created = DateTime.Now;
                if (activityPublishApplyDto.IsAdmin)
                {
                    activityPublishApply.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
                }
                else
                {
                    activityPublishApply.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Add(activityPublishApply);
                activityPublishApplyResponse.Id = activityPublishApply.ActivityID;
                if (activityPublishApplyDto.IsAdmin)
                {
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord
                    {
                        ApproveRelateID = activityId,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.ActivityApply.GetHashCode().ToString(),
                        ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString(),
                        ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString(),
                        Applicant = user.UserID,
                        Approver = user.UserID
                    };
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                }
                else 
                {
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord
                    {
                        ApproveRelateID = activityId,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.ActivityApply.GetHashCode().ToString(),
                        ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        Applicant = user.UserID,
                        Approver = user.UserID
                    };
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                }
            
                //如果是web端需要上传编辑器中的图片
                if (activityPublishApply.Origin == "Web")
                {
                    string[] imgList = Utility.GetHtmlImageUrlList(activityPublishApply.ActivityDescription);
                    for (int i = 0; i < imgList.Count(); i++)
                    {
                        string startValue = "ActivityFolder/";
                        var imgsrc = imgList[i].Substring(imgList[i].IndexOf(startValue) + startValue.Length, imgList[i].Length - imgList[i].IndexOf(startValue) - startValue.Length);
                        ActivityImages activityImage = new ActivityImages();
                        activityImage.ImgID = Guid.NewGuid();
                        activityImage.ActivityID = activityPublishApply.ActivityID;
                        activityImage.ImgSrc = imgsrc;
                        activityImage.Sort = i;
                        SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Add(activityImage);
                    }
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[ActivityPublishApplyManager Method(CreateActivityPublishApply): ActivityPublishApplyCreateRequest is null]未获取到提交的活动信息！");
            }
            return activityPublishApplyResponse;
        }

        public ActivityPublishApplyResponse RevokeActivityPublishApply(ActivityPublishApplyCreateRequest activityPublishApplyDto)
        {
            var activityPublishApplyResponse = new ActivityPublishApplyResponse();
            ActivityPublishApply activityPublishApply = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.FirstOrDefault(p => p.ActivityID == activityPublishApplyDto.ActivityPublishApply.ActivityID);
            if (activityPublishApply != null)
            {
                activityPublishApply.Status = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                activityPublishApplyResponse.Id = activityPublishApply.ActivityID;
            }
            User user = UserHelper.CurrentUser;
            //审批记录
            ApproveRecord approveRecord = new ApproveRecord();
            approveRecord.ApproveRelateID = activityPublishApply.ActivityID;
            approveRecord.RecordID = Guid.NewGuid();
            approveRecord.Created = DateTime.Now;
            approveRecord.ApplyType =
                SISPIncubatorOnlineEnum.ApplyType.ActivityApply.GetHashCode().ToString();
            approveRecord.ApproveNode =
                       SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
            approveRecord.ApproveResult =
                SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
            approveRecord.Applicant = user.UserID;
            approveRecord.Approver = user.UserID;
            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            return activityPublishApplyResponse;
        }

        /// <summary>
        /// 更新活动申请列表数据
        /// </summary>
        /// <param name="activityPublishApplyDto"></param>
        /// <returns></returns>
        public void UpdateActivityPublishApply(ActivityPublishApplyUpdateRequest activityPublishApplyDto)
        {
            if (activityPublishApplyDto != null)
            {

                var activityPublishApply =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.FirstOrDefault(
                        x => x.ActivityID == activityPublishApplyDto.ActivityPublishApply.ActivityID);
                if (activityPublishApply != null)
                {
                    User user = UserHelper.CurrentUser;
                    ActivityPublishApplyDTOToActivityPublishApply(activityPublishApplyDto.ActivityPublishApply,
                        activityPublishApply, activityPublishApplyDto.IsAdmin);
                    if (!activityPublishApplyDto.IsAdmin) 
                    {
                        //审批记录
                        ApproveRecord approveRecord = new ApproveRecord
                        {
                            ApproveRelateID = activityPublishApply.ActivityID,
                            RecordID = Guid.NewGuid(),
                            Created = DateTime.Now,
                            ApplyType = SISPIncubatorOnlineEnum.ApplyType.ActivityApply.GetHashCode().ToString(),
                            ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                            ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                            Applicant = user.UserID,
                            Approver = user.UserID
                        };
                        SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                    }
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    throw new BadRequestException(
                   "[ActivityPublishApplyManager Method(UpdateActivityPublishApply): activityPublishApply is null]未查询到活动信息！");
                }
            }
            else
            {
                throw new BadRequestException(
                    "[ActivityPublishApplyManager Method(UpdateActivityPublishApply): ActivityPublishApplyUpdateRequest is null]未获取到提交的活动信息！");
            }
        }

        /// <summary>
        /// 根据ID删除活动发布申请列表对应数据
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public void DeleteActivityPublishApply(Guid id)
        {
            var activityPublishApply = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.FirstOrDefault(x => x.ActivityID == id);
            if (activityPublishApply != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Remove(activityPublishApply);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[ActivityPublishApplyManager Method(DeleteActivityPublishApply): activityPublishApply is null id=" + id + "]未查询到活动信息！");
            }
        }

        public ActivityPublishApplyResponse GetMyAll(ActivityPublishApplyRequest conditions)
        {
            User user = UserHelper.CurrentUser;
            ActivityPublishApplyResponse activityPublishApplyResponse = new ActivityPublishApplyResponse();
            IQueryable<ActivityPublishApply> activityPublishApplys;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                activityPublishApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x=>x.CreatedBy==user.UserID).OrderByDescending(p => p.Created )
                        .Skip(pageSize*pageIndex)
                        .Take(pageSize);
            }
            else
            {
                activityPublishApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.CreatedBy == user.UserID).OrderByDescending(p => p.Created);
            }
            var list = activityPublishApplys.ToList();
            List<ActivityPublishApplyDTO> dtoList = new List<ActivityPublishApplyDTO>();
            Utility.CopyList<ActivityPublishApply, ActivityPublishApplyDTO>(list, dtoList);
            activityPublishApplyResponse.Results = dtoList;
            activityPublishApplyResponse.TotalCount =
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.CreatedBy == user.UserID).Count();

             if(!conditions.PageSize.HasValue)
            {
                conditions.PageSize=0;
                activityPublishApplyResponse.TotalPage=1;
            }
            else
            {
                int size=Convert.ToInt32(conditions.PageSize);
                activityPublishApplyResponse.TotalPage = (activityPublishApplyResponse.TotalCount + size - 1) / size;
            }
            return activityPublishApplyResponse;
        }
        /// <summary>
        /// 根据查询条件查询活动发布申请列表数据
        /// </summary>
        /// <param name="conditions">多条件</param>
        /// <returns></returns>
        public ActivityPublishApplyResponse GetAll(ActivityPublishApplyRequest conditions)
        {
            ActivityPublishApplyResponse activityPublishApplyResponse = new ActivityPublishApplyResponse();
            IQueryable<ActivityPublishApply> activityPublishApplys;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                activityPublishApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.OrderByDescending(p => p.Created)
                        .Skip(pageSize*pageIndex)
                        .Take(pageSize);
            }
            else
            {
                activityPublishApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.OrderByDescending(p => p.Created);
            }
            var list = activityPublishApplys.ToList();
            List<ActivityPublishApplyDTO> dtoList = new List<ActivityPublishApplyDTO>();
            Utility.CopyList<ActivityPublishApply, ActivityPublishApplyDTO>(list, dtoList);
            activityPublishApplyResponse.Results = dtoList;
            activityPublishApplyResponse.TotalCount =
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Count();

             if(!conditions.PageSize.HasValue)
            {
                conditions.PageSize=0;
                activityPublishApplyResponse.TotalPage=1;
            }
            else
            {
                int size=Convert.ToInt32(conditions.PageSize);
                activityPublishApplyResponse.TotalPage = (activityPublishApplyResponse.TotalCount + size - 1) / size;
            }
            return activityPublishApplyResponse;
        }

        private void ActivityPublishApplyDTOToActivityPublishApply(ActivityPublishApply activityPublishApplyDto, ActivityPublishApply activityPublishApply, bool isAdmin)
        {
            activityPublishApply.Address = activityPublishApplyDto.Address;
            activityPublishApply.CompanyName = activityPublishApplyDto.CompanyName;
            activityPublishApply.PhoneNumber = activityPublishApplyDto.PhoneNumber;
            activityPublishApply.Topic = activityPublishApplyDto.Topic;
            activityPublishApply.Email = activityPublishApplyDto.Email;
            activityPublishApply.Sponsor = activityPublishApplyDto.Sponsor;
            activityPublishApply.Co_sponsor = activityPublishApplyDto.Co_sponsor;
            activityPublishApply.Industry = activityPublishApplyDto.Industry;
            activityPublishApply.StartTime = activityPublishApplyDto.StartTime;
            activityPublishApply.EndTime = activityPublishApplyDto.EndTime;
            activityPublishApply.TimeBucket = activityPublishApplyDto.TimeBucket;
            activityPublishApply.Remark = activityPublishApplyDto.Remark;
            activityPublishApply.ActivityDescription = activityPublishApplyDto.ActivityDescription;
            if (!isAdmin)
            {
                activityPublishApply.Status = activityPublishApplyDto.Status;
            }
            
        }

        public void UpdateActivityStatusAndApprove(ActivityPublishApplyApproveRequest activityPublishApplyApproveRequest)
        {
            User user = UserHelper.CurrentUser;
            ApproveRecord approveRecord=new ApproveRecord();
            MessageManager messageManager = new MessageManager();
            //审批记录
            approveRecord.ApproveRelateID = activityPublishApplyApproveRequest.Id;
            approveRecord.RecordID = Guid.NewGuid();
            approveRecord.Created = DateTime.Now;
            string userId = string.Empty;
            if (activityPublishApplyApproveRequest.Category == "0")
            {
                var activity = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.ActivityID == activityPublishApplyApproveRequest.Id).FirstOrDefault();
                activity.Status = activityPublishApplyApproveRequest.ApproveStatus;
                userId = activity.CreatedBy.ToString();
                approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.ActivityApply.GetHashCode().ToString();
            }
            else
            {
                var activity = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.ActivityID == activityPublishApplyApproveRequest.Id).FirstOrDefault();
                activity.Status = activityPublishApplyApproveRequest.ApproveStatus;
                userId = activity.CreatedBy.ToString();
                approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.IncubatorApply.GetHashCode().ToString();
                
            }
            approveRecord.Applicant = user.UserID;
            // ReSharper disable once ConvertConditionalTernaryToNullCoalescing
            approveRecord.Comments = activityPublishApplyApproveRequest.Comments;
            approveRecord.Approver = user.UserID;
            if (activityPublishApplyApproveRequest.ApproveStatus == "2")
            {
                approveRecord.ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                messageManager.CreateSystemMessage(userId, "您的活动发布申请审批已审批通过！");
            }
            else
            {
                approveRecord.ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                messageManager.CreateSystemMessage(userId, "您的活动发布申请审批已驳回，请查看详情！");
            }
            
            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        public void RemoveActivityRecord(ActivityPublishApplyApproveRequest activityPublishApplyApproveRequest)
        {
            var approvedRecords =  SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Where(x => x.ApproveRelateID == activityPublishApplyApproveRequest.Id).ToList();
            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.RemoveRange(approvedRecords);
            if (activityPublishApplyApproveRequest.Category == "0")
            {
                var activity = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.ActivityID == activityPublishApplyApproveRequest.Id).FirstOrDefault();
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Remove(activity);

            }
            else
            {
                var activity = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.ActivityID == activityPublishApplyApproveRequest.Id).FirstOrDefault();
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Remove(activity);
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }
    }
}