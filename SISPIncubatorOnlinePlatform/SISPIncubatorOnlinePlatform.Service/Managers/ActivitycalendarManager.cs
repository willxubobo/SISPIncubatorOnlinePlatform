using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Common;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class ActivityCalendarManager : BaseManager
    {
        /// <summary>
        /// 获取当月有活动的日期
        /// </summary>
        /// <param name="activityCalendarRequest"></param>
        /// <returns></returns>
        public ActivityCalendarResponse GetMarkedDate(ActivityCalendarRequest activityCalendarRequest)
        {
            ActivityCalendarResponse activityCalendarResponse = new ActivityCalendarResponse();
            int year = activityCalendarRequest.ActivityCalendarDto.Year;
            int month = activityCalendarRequest.ActivityCalendarDto.Month;
            DateTime starTime = new DateTime(year, month, 1);
            DateTime lasDateTime = starTime.AddMonths(1);
            List<DateTime> dateTimes = new List<DateTime>();
            string status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            var activityPublishApplies = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where<ActivityPublishApply>(x => x.StartTime >= starTime && x.StartTime <= lasDateTime && x.Status == status);
            var incubatorActivityApplies = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where<IncubatorActivityApply>(x => x.StartTime >= starTime && x.StartTime <= lasDateTime && x.Status == status);
            var activityPublishLists = activityPublishApplies.ToList<ActivityPublishApply>();
            var incubatorActivityLists = incubatorActivityApplies.ToList<IncubatorActivityApply>();
            foreach (var activityPublish in activityPublishLists)
            {
                for (DateTime date = activityPublish.StartTime; date <= activityPublish.EndTime; date = date.AddDays(1))
                {
                    if (!dateTimes.Contains(date))
                    {
                        dateTimes.Add(date);
                    }
                }

            }
            foreach (var incubatorActivity in incubatorActivityLists)
            {
                for (DateTime date = incubatorActivity.StartTime; date <= incubatorActivity.EndTime; date = date.AddDays(1))
                {
                    if (!dateTimes.Contains(date))
                    {
                        dateTimes.Add(date);
                    }
                }
            }
            activityCalendarResponse.DateList = dateTimes;
            return activityCalendarResponse;
        }

        /// <summary>
        /// 获取当天活动信息
        /// </summary>
        /// <param name="activityCalendarRequest"></param>
        /// <returns></returns>
        public ActivityCalendarInformationResponse GetActivityInformation(ActivityCalendarInformationRequest activityCalendarRequest)
        {
            ActivityCalendarInformationResponse activityCalendarMessageResponse = new ActivityCalendarInformationResponse();
            activityCalendarMessageResponse.ActivityCalendarResponseList = new List<ActivityCalendarResponseDTO>();
            DateTime dateTime = activityCalendarRequest.ActivityCalendarDto.DateTime;
            string status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            var activityPublishApplies = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(
                x => x.StartTime <= dateTime && x.EndTime >= dateTime && x.Status == status);
            var activityPublishLists = activityPublishApplies.ToList();
            foreach (var activityPublishApply in activityPublishLists)
            {
                ActivityCalendarResponseDTO activityCalendarResponseDto = new ActivityCalendarResponseDTO();
                activityCalendarResponseDto.ActivityID = activityPublishApply.ActivityID;
                activityCalendarResponseDto.Topic = activityPublishApply.Topic;
                activityCalendarResponseDto.Category = SISPIncubatorOnlineEnum.ActivityCategory.ActivityPublishApply.GetHashCode();
                activityCalendarMessageResponse.ActivityCalendarResponseList.Add(activityCalendarResponseDto);
            }
            var incubatorActivityApplies = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(
                x => x.StartTime <= dateTime && x.EndTime >= dateTime && x.Status == status);
            var incubatorActivityLists = incubatorActivityApplies.ToList();
            foreach (var incubatorActivityApply in incubatorActivityLists)
            {
                ActivityCalendarResponseDTO activityCalendarResponseDto = new ActivityCalendarResponseDTO();
                activityCalendarResponseDto.ActivityID = incubatorActivityApply.ActivityID;
                activityCalendarResponseDto.Topic = incubatorActivityApply.Topic;
                activityCalendarResponseDto.Category = SISPIncubatorOnlineEnum.ActivityCategory.IncubatorActivityApply.GetHashCode();
                activityCalendarMessageResponse.ActivityCalendarResponseList.Add(activityCalendarResponseDto);
            }
            return activityCalendarMessageResponse;
        }

        public ActivityDetailResponse GetActivityDetail(ActivityDetailRequest activityDetailRequest)
        {
            ActivityDetailResponse activityDetailResponse = new ActivityDetailResponse();
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            var activityFolder = ConfigurationManager.AppSettings["ActivityFolder"];
            var imgSrcList = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Where(
                x => x.ActivityID == activityDetailRequest.Id).OrderBy(x => x.Sort).Select(x => x.ImgSrc).ToList();
            IList<string> imgList = imgSrcList.Select(img => string.Concat(serviceUrl, activityFolder, img)).ToList();
            if (activityDetailRequest.Category ==
                SISPIncubatorOnlineEnum.ActivityCategory.IncubatorActivityApply.GetHashCode())
            {
                var incubatorActivityApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.FirstOrDefault(x => x.ActivityID == activityDetailRequest.Id);

                if (incubatorActivityApply != null)
                {
                    activityDetailResponse.ActivityId = incubatorActivityApply.ActivityID;
                    activityDetailResponse.ActivityDescription = incubatorActivityApply.ActivityDescription;
                    activityDetailResponse.Address = incubatorActivityApply.Address;
                    activityDetailResponse.Cosponsor = incubatorActivityApply.Co_sponsor;
                    activityDetailResponse.Email = incubatorActivityApply.Email;
                    activityDetailResponse.EndTime = incubatorActivityApply.EndTime;
                    activityDetailResponse.ImgSrcList = imgList;
                    activityDetailResponse.PhoneNumber = incubatorActivityApply.PhoneNumber;
                    activityDetailResponse.Sponsor = incubatorActivityApply.Sponsor;
                    activityDetailResponse.StartTime = incubatorActivityApply.StartTime;
                    activityDetailResponse.TimeBucket = incubatorActivityApply.TimeBucket;
                    activityDetailResponse.Topic = incubatorActivityApply.Topic;
                }

            }
            else
            {
                var activityPublishApply = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.FirstOrDefault(x => x.ActivityID == activityDetailRequest.Id);
                if (activityPublishApply != null)
                {
                    activityDetailResponse.ActivityId = activityPublishApply.ActivityID;
                    activityDetailResponse.ActivityDescription = activityPublishApply.ActivityDescription;
                    activityDetailResponse.Address = activityPublishApply.Address;
                    activityDetailResponse.Cosponsor = activityPublishApply.Co_sponsor;
                    activityDetailResponse.Email = activityPublishApply.Email;
                    activityDetailResponse.EndTime = activityPublishApply.EndTime;
                    activityDetailResponse.ImgSrcList = imgList;
                    activityDetailResponse.PhoneNumber = activityPublishApply.PhoneNumber;
                    activityDetailResponse.Sponsor = activityPublishApply.Sponsor;
                    activityDetailResponse.StartTime = activityPublishApply.StartTime;
                    activityDetailResponse.TimeBucket = activityPublishApply.TimeBucket;
                    activityDetailResponse.Topic = activityPublishApply.Topic;
                }
            }
            try
            {
                User user = UserHelper.CurrentUser;
                activityDetailResponse.Mobile = user.Mobile;
                activityDetailResponse.UserName = user.UserName;
                var activitySignUps = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Where(
                    x => x.ActivityID == activityDetailRequest.Id && x.CreatedBy == user.UserID);
                if (activitySignUps.Any())
                {
                    activityDetailResponse.Apply = true;
                }
            }
            catch (Exception)
            {
                activityDetailResponse.Apply = false;
            }

            return activityDetailResponse;
        }
        public ActivityDetailResponse GetActivityDetailByAnonymous(ActivityDetailRequest activityDetailRequest)
        {
            ActivityDetailResponse activityDetailResponse = new ActivityDetailResponse();
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            var activityFolder = ConfigurationManager.AppSettings["ActivityFolder"];
            var imgSrcList = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Where(
                x => x.ActivityID == activityDetailRequest.Id).OrderBy(x => x.Sort).Select(x => x.ImgSrc).ToList();
            IList<string> imgList = imgSrcList.Select(img => string.Concat(serviceUrl, activityFolder, img)).ToList();
            if (activityDetailRequest.Category ==
                SISPIncubatorOnlineEnum.ActivityCategory.IncubatorActivityApply.GetHashCode())
            {
                var incubatorActivityApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.FirstOrDefault(x => x.ActivityID == activityDetailRequest.Id);

                if (incubatorActivityApply != null)
                {
                    activityDetailResponse.ActivityId = incubatorActivityApply.ActivityID;
                    activityDetailResponse.ActivityDescription = incubatorActivityApply.ActivityDescription;
                    activityDetailResponse.Address = incubatorActivityApply.Address;
                    activityDetailResponse.Cosponsor = incubatorActivityApply.Co_sponsor;
                    activityDetailResponse.Email = string.Empty;
                    activityDetailResponse.EndTime = incubatorActivityApply.EndTime;
                    activityDetailResponse.ImgSrcList = imgList;
                    activityDetailResponse.PhoneNumber = string.Empty;
                    activityDetailResponse.Sponsor = incubatorActivityApply.Sponsor;
                    activityDetailResponse.StartTime = incubatorActivityApply.StartTime;
                    activityDetailResponse.TimeBucket = incubatorActivityApply.TimeBucket;
                    activityDetailResponse.Topic = incubatorActivityApply.Topic;
                }

            }
            else
            {
                var activityPublishApply = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.FirstOrDefault(x => x.ActivityID == activityDetailRequest.Id);
                if (activityPublishApply != null)
                {
                    activityDetailResponse.ActivityId = activityPublishApply.ActivityID;
                    activityDetailResponse.ActivityDescription = activityPublishApply.ActivityDescription;
                    activityDetailResponse.Address = activityPublishApply.Address;
                    activityDetailResponse.Cosponsor = activityPublishApply.Co_sponsor;
                    activityDetailResponse.Email = string.Empty;
                    activityDetailResponse.EndTime = activityPublishApply.EndTime;
                    activityDetailResponse.ImgSrcList = imgList;
                    activityDetailResponse.PhoneNumber = string.Empty;
                    activityDetailResponse.Sponsor = activityPublishApply.Sponsor;
                    activityDetailResponse.StartTime = activityPublishApply.StartTime;
                    activityDetailResponse.TimeBucket = activityPublishApply.TimeBucket;
                    activityDetailResponse.Topic = activityPublishApply.Topic;
                }
            }
            try
            {
                User user = UserHelper.CurrentUser;
                activityDetailResponse.Mobile = user.Mobile;
                activityDetailResponse.UserName = user.UserName;
                var activitySignUps = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Where(
                    x => x.ActivityID == activityDetailRequest.Id && x.CreatedBy == user.UserID);
                if (activitySignUps.Any())
                {
                    activityDetailResponse.Apply = true;
                }
            }
            catch (Exception)
            {
                activityDetailResponse.Apply = false;
            }

            return activityDetailResponse;
        }
        public ActivityManageResponse GetActivityAll(ActivityManageRequest conditions)
        {
            ActivityManageResponse activityManageResponse = new Models.ActivityManageResponse();
            IQueryable<ActivityManageResponseDTO> activityManages;
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            string pendingStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            string dismissedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode());
            string revokeStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode());
            if (conditions.Status == Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.All.GetHashCode()))
            {
                activityManages = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x=>x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 0, Status = x.Status }).Union(
                   SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 1, Status = x.Status })).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == pendingStatus)
            {
                activityManages = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.Status == pendingStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 0, Status = x.Status }).Union(
                               SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.Status == pendingStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 1, Status = x.Status })).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == dismissedStatus)
            {
                activityManages = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.Status == dismissedStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 0, Status = x.Status }).Union(
                               SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.Status == dismissedStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 1, Status = x.Status })).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == revokeStatus)
            {
                activityManages = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.Status == revokeStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 0, Status = x.Status }).Union(
                               SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.Status == revokeStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 1, Status = x.Status })).OrderByDescending(x => x.Created);
            }
            else
            {
                activityManages = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.Where(x => x.Status == approvedStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 0, Status = x.Status }).Union(
                               SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.Where(x => x.Status == approvedStatus && x.Topic.Contains(conditions.SearchString)).Select(x => new ActivityManageResponseDTO { ActivityID = x.ActivityID, CompanyName = x.CompanyName, Topic = x.Topic, StartTime = x.StartTime, EndTime = x.EndTime, Created = x.Created, Category = 1, Status = x.Status })).OrderByDescending(x => x.Created);
            }
            activityManageResponse.TotalCount = activityManages.Count();
            activityManageResponse.Results = activityManages.Skip(pageSize*pageIndex)
                        .Take(pageSize).ToList();
            

            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                activityManageResponse.TotalPage = 1;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                activityManageResponse.TotalPage = (activityManageResponse.TotalCount + size - 1) / size;
            }
            return activityManageResponse;

        }
    }
}