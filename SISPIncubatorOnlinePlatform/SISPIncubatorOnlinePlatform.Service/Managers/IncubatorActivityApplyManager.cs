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
    public class IncubatorActivityApplyManager : BaseManager
    {
        /// <summary>
        /// 根据id获取孵化器活动申请列表
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        public IncubatorActivityApplyResponse GetIncubatorActivityApplyByGuid(Guid id)
        {
            IncubatorActivityApplyResponse incubatorActivityApplyResponse = new IncubatorActivityApplyResponse();
            var incubatorActivityApply =
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.ActivityID == id).ToList();
            List<IncubatorActivityApplyDTO> dtoList = new List<IncubatorActivityApplyDTO>();
            Utility.CopyList<IncubatorActivityApply, IncubatorActivityApplyDTO>(incubatorActivityApply, dtoList);
            incubatorActivityApplyResponse.Results = dtoList;
            return incubatorActivityApplyResponse;
        }

        /// <summary>
        /// 创建孵化器活动申请列表
        /// </summary>
        /// <param name="incubatorActivityApplyDto"></param>
        /// <returns></returns>
        public IncubatorActivityApplyResponse CreateIncubatorActivityApply(
            IncubatorActivityApplyCreateRequest incubatorActivityApplyDto)
        {
            var incubatorActivityApplyResponse = new IncubatorActivityApplyResponse();
            User user = UserHelper.CurrentUser;
            IncubatorActivityApply incubatorActivityApply = new IncubatorActivityApply();
            Utility.CopyDtoToDao<IncubatorCreateActivityApplyDTO, IncubatorActivityApply>(
                incubatorActivityApplyDto.IncubatorActivityApply, incubatorActivityApply);
            var activityId = Guid.NewGuid();
            incubatorActivityApply.CreatedBy = user.UserID;
            incubatorActivityApply.ActivityID = activityId;
            incubatorActivityApply.Created = DateTime.Now;
            if (incubatorActivityApplyDto.IsAdmin)
            {
                incubatorActivityApply.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            }
            else
            {
                incubatorActivityApply.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Add(incubatorActivityApply);
            incubatorActivityApplyResponse.Id = incubatorActivityApply.ActivityID;
            if (incubatorActivityApplyDto.IsAdmin)
            {
                //审批记录
                ApproveRecord approveRecord = new ApproveRecord
                {
                    ApproveRelateID = activityId,
                    RecordID = Guid.NewGuid(),
                    Created = DateTime.Now,
                    ApplyType = SISPIncubatorOnlineEnum.ApplyType.IncubatorActivityApply.GetHashCode().ToString(),
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
                    ApplyType = SISPIncubatorOnlineEnum.ApplyType.IncubatorActivityApply.GetHashCode().ToString(),
                    ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                    ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                    Applicant = user.UserID,
                    Approver = user.UserID
                };
                SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            }

            if (incubatorActivityApply.Origin == "Web")
            {
                string[] imgList = Utility.GetHtmlImageUrlList(incubatorActivityApply.ActivityDescription);
                for (int i = 0; i < imgList.Count(); i++)
                {
                    string startValue = "ActivityFolder/";
                    var imgsrc = imgList[i].Substring(imgList[i].IndexOf(startValue) + startValue.Length, imgList[i].Length - imgList[i].IndexOf(startValue) - startValue.Length);
                    ActivityImages activityImage = new ActivityImages();
                    activityImage.ImgID = Guid.NewGuid();
                    activityImage.ActivityID = incubatorActivityApply.ActivityID;
                    activityImage.ImgSrc = imgsrc;
                    activityImage.Sort = i;
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Add(activityImage);
                }
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            return incubatorActivityApplyResponse;
        }

        /// <summary>
        /// 更新孵化器活动申请列表数据
        /// </summary>
        /// <param name="incubatorActivityApplyDto"></param>
        /// <returns></returns>
        public void UpdateIncubatorActivityApply(IncubatorActivityApplyUpdateRequest incubatorActivityApplyDto)
        {
            User user = UserHelper.CurrentUser;
                var incubatorActivityApply =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.FirstOrDefault(
                        x => x.ActivityID == incubatorActivityApplyDto.IncubatorActivityApply.ActivityID);
                IncubatorActivityApplyDTOToIncubatorActivityApply(incubatorActivityApplyDto.IncubatorActivityApply,
                        incubatorActivityApply, incubatorActivityApplyDto.IsAdmin);
                if (!incubatorActivityApplyDto.IsAdmin)
                {
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord
                    {
                        ApproveRelateID = incubatorActivityApply.ActivityID,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.IncubatorActivityApply.GetHashCode().ToString(),
                        ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        Applicant = user.UserID,
                        Approver = user.UserID
                    };
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                }
             
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        /// <summary>
        /// 根据ID删除孵化器活动申请列表对应数据
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public void DeleteIncubatorActivityApply(Guid id)
        {
            var incubatorActivityApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.FirstOrDefault(x => x.ActivityID == id);
            if (incubatorActivityApply != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Remove(incubatorActivityApply);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[IncubatorActivityApplyManager Method(DeleteIncubatorActivityApply): IncubatorActivityApply is null id=" + id + "]未查询到活动信息！");
            }
        }

        /// <summary>
        /// 根据查询条件查询孵化器活动申请列表数据
        /// </summary>
        /// <param name="conditions">多条件</param>
        /// <returns></returns>
        public IncubatorActivityApplyResponse GetAll(IncubatorActivityApplyRequest conditions)
        {
            IncubatorActivityApplyResponse incubatorActivityApplyResponse = new IncubatorActivityApplyResponse();
            IQueryable<IncubatorActivityApply> incubatorActivityApplys;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                incubatorActivityApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.OrderByDescending(p => p.Created)
                        .Skip(pageSize*pageIndex)
                        .Take(pageSize);
            }
            else
            {
                incubatorActivityApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.OrderByDescending(p => p.Created);
            }
            var list = incubatorActivityApplys.ToList();
            List<IncubatorActivityApplyDTO> dtoList = new List<IncubatorActivityApplyDTO>();
            Utility.CopyList<IncubatorActivityApply, IncubatorActivityApplyDTO>(list, dtoList);
            incubatorActivityApplyResponse.Results = dtoList;
            incubatorActivityApplyResponse.TotalCount =
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Count();
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                incubatorActivityApplyResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                incubatorActivityApplyResponse.TotalPage = (incubatorActivityApplyResponse.TotalCount + size - 1) / size;
            }
            return incubatorActivityApplyResponse;
        }

        public IncubatorActivityApplyResponse RevokeIncubatorActivityApply(IncubatorActivityApplyCreateRequest incubatorActivityApplyDto)
        {
            var incubatorActivityApplyResponse = new IncubatorActivityApplyResponse();
            IncubatorActivityApply incubatorActivityApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.FirstOrDefault(p => p.ActivityID == incubatorActivityApplyDto.IncubatorActivityApply.ActivityID);
            if (incubatorActivityApply != null)
            {
                incubatorActivityApply.Status = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                incubatorActivityApplyResponse.Id = incubatorActivityApply.ActivityID;
            }
            User user = UserHelper.CurrentUser;
            //审批记录
            ApproveRecord approveRecord = new ApproveRecord();
            approveRecord.ApproveRelateID = incubatorActivityApply.ActivityID;
            approveRecord.RecordID = Guid.NewGuid();
            approveRecord.Created = DateTime.Now;
            approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.ActivityApply.GetHashCode().ToString();
            approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
            approveRecord.ApproveResult =
                SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
            approveRecord.Applicant = user.UserID;
            approveRecord.Approver = user.UserID;
            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            return incubatorActivityApplyResponse;
        }

        
        public IncubatorActivityApplyResponse GetMyAll(IncubatorActivityApplyRequest conditions)
        {
            User user = UserHelper.CurrentUser;
            IncubatorActivityApplyResponse incubatorActivityApplyResponse = new IncubatorActivityApplyResponse();
            IQueryable<IncubatorActivityApply> incubatorActivityApplys;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                incubatorActivityApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.CreatedBy == user.UserID).OrderByDescending(p => p.Created)
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize);
            }
            else
            {
                incubatorActivityApplys =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.CreatedBy == user.UserID).OrderByDescending(p => p.Created);
            }
            var list = incubatorActivityApplys.ToList();
            List<IncubatorActivityApplyDTO> dtoList = new List<IncubatorActivityApplyDTO>();
            Utility.CopyList<IncubatorActivityApply, IncubatorActivityApplyDTO>(list, dtoList);
            incubatorActivityApplyResponse.Results = dtoList;
            incubatorActivityApplyResponse.TotalCount =
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.CreatedBy == user.UserID).Count();
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                incubatorActivityApplyResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                incubatorActivityApplyResponse.TotalPage = (incubatorActivityApplyResponse.TotalCount + size - 1) / size;
            }
            return incubatorActivityApplyResponse;
        }
        private void IncubatorActivityApplyDTOToIncubatorActivityApply(IncubatorActivityApplyDTO incubatorActivityApplyDto, IncubatorActivityApply incubatorActivityApply,bool isAdmin)
        {
            incubatorActivityApply.Address = incubatorActivityApplyDto.Address;
            incubatorActivityApply.CompanyName = incubatorActivityApplyDto.CompanyName;
            incubatorActivityApply.PhoneNumber = incubatorActivityApplyDto.PhoneNumber;
            incubatorActivityApply.Topic = incubatorActivityApplyDto.Topic;
            incubatorActivityApply.Email = incubatorActivityApplyDto.Email;
            incubatorActivityApply.Sponsor = incubatorActivityApplyDto.Sponsor;
            incubatorActivityApply.Co_sponsor = incubatorActivityApplyDto.Co_sponsor;
            incubatorActivityApply.Industry = incubatorActivityApplyDto.Industry;
            incubatorActivityApply.StartTime = incubatorActivityApplyDto.StartTime;
            incubatorActivityApply.EndTime = incubatorActivityApplyDto.EndTime;
            incubatorActivityApply.TimeBucket = incubatorActivityApplyDto.TimeBucket;
            incubatorActivityApply.Remark = incubatorActivityApplyDto.Remark;
            incubatorActivityApply.ActivityDescription = incubatorActivityApplyDto.ActivityDescription;
            if (!isAdmin)
            {
                incubatorActivityApply.Status = incubatorActivityApplyDto.Status;
            }
            incubatorActivityApply.Participants = incubatorActivityApplyDto.Participants;
            incubatorActivityApply.Industry = incubatorActivityApplyDto.Industry;
            incubatorActivityApply.DemandForSpace = incubatorActivityApplyDto.DemandForSpace;
            incubatorActivityApply.DemandForStall = incubatorActivityApplyDto.DemandForStall;
            incubatorActivityApply.FreeItem = incubatorActivityApplyDto.FreeItem;
            incubatorActivityApply.ChargeItem = incubatorActivityApplyDto.ChargeItem;
        }
    }
}