using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Runtime.CompilerServices;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    /// <summary>
    ///表格需求发布
    /// </summary>
    public class DemandPublishManager : BaseManager
    {
        string serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];

        /// <summary>
        /// 获取需求发表
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        public DemandPublishResponse GetDemandPublishByGuid(Guid id)
        {
            DemandPublishResponse demandPublishResponse = new DemandPublishResponse();
            var demandPublish =
                SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.DemandID == id).ToList();
            List<DemandPublishDTO> dtoList = new List<DemandPublishDTO>();
            Utility.CopyList<DemandPublish, DemandPublishDTO>(demandPublish, dtoList);
            foreach (var list in dtoList)
            {
                string img = SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Where(x => x.UserID == list.CreatedBy).Select(x => x.Headimgurl).FirstOrDefault();
                if (!img.Contains("http"))
                {
                    list.ImgUrl = serviceUrl + img;
                }
                else
                {
                    list.ImgUrl = img;
                }

            }
            demandPublishResponse.Results = dtoList;
            return demandPublishResponse;
        }

        public DemandPublishResponse GetDemandPublishByAnonymou(Guid id)
        {
            DemandPublishResponse demandPublishResponse = new DemandPublishResponse();
            var demandPublish =
                SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.DemandID == id).ToList();
            List<DemandPublishDTO> dtoList = new List<DemandPublishDTO>();
            Utility.CopyList<DemandPublish, DemandPublishDTO>(demandPublish, dtoList);
            foreach (var list in dtoList)
            {
                string img = SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Where(x => x.UserID == list.CreatedBy).Select(x => x.Headimgurl).FirstOrDefault();
                if (!img.Contains("http"))
                {
                    list.ImgUrl = serviceUrl + img;
                }
                else
                {
                    list.ImgUrl = img;
                }
                list.Email = string.Empty;
                list.Mobile = string.Empty;

            }
            demandPublishResponse.Results = dtoList;
            return demandPublishResponse;
        }

        /// <summary>
        /// 创建需求发布表
        /// </summary>
        /// <param name="demandPublishDto">表实体</param>
        /// <returns></returns>
        public DemandPublishResponse CreateDemandPublish(DemandPublishCreateRequest demandPublishDto)
        {
            var demandPublishResponse = new DemandPublishResponse();
            if (demandPublishDto != null)
            {
                User user = UserHelper.CurrentUser;
                var demandPublish = demandPublishDto.DemandPublish;
                demandPublish.CreatedBy = user.UserID;
                var demandId = Guid.NewGuid();
                demandPublish.DemandID = demandId;
                demandPublish.Created = DateTime.Now;
                if (demandPublishDto.IsAdmin)
                {
                    demandPublish.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
                }
                else
                {
                    demandPublish.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
                }

                SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Add(demandPublish);
                if (demandPublishDto.IsAdmin)
                {
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord
                    {
                        ApproveRelateID = demandId,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.DemandApply.GetHashCode().ToString(),
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
                        ApproveRelateID = demandId,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.DemandApply.GetHashCode().ToString(),
                        ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        Applicant = user.UserID,
                        Approver = user.UserID
                    };
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                }

                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                demandPublishResponse.Id = demandPublish.DemandID;
            }
            else
            {
                throw new BadRequestException("[DemandPublishManager Method(CreateDemandPublish): DemandPublishCreateRequest is null]未获取到提交的活动信息！");
            }
            return demandPublishResponse;
        }
        public DemandPublishResponse RevokeDemandPublish(DemandPublishCreateRequest demandPublishDto)
        {
            var demandPublishResponse = new DemandPublishResponse();
            DemandPublish demandPublish = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.FirstOrDefault(p => p.DemandID == demandPublishDto.DemandPublish.DemandID);
            if (demandPublish != null)
            {
                demandPublish.Status = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                demandPublishResponse.Id = demandPublish.DemandID;
            }
            User user = UserHelper.CurrentUser;
            //审批记录
            ApproveRecord approveRecord = new ApproveRecord();
            approveRecord.ApproveRelateID = demandPublish.DemandID;
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
            return demandPublishResponse;
        }



        /// <summary>
        /// 更新需求发布表
        /// </summary>
        /// <param name="demandPublishDto">需求发布表实体</param>
        /// <returns></returns>
        public void UpdateDemandPublish(DemandPublishUpdateRequest demandPublishDto)
        {
            if (demandPublishDto != null)
            {

                var demandPublish =
                    SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.FirstOrDefault(
                        x => x.DemandID == demandPublishDto.DemandPublish.DemandID);
                if (demandPublish != null)
                {
                    User user = UserHelper.CurrentUser;
                    DemandPublishDTOToDemandPublish(demandPublishDto.DemandPublish,
                        demandPublish, demandPublishDto.IsAdmin);
                    if (!demandPublishDto.IsAdmin)
                    {
                        //审批记录
                        ApproveRecord approveRecord = new ApproveRecord
                        {
                            ApproveRelateID = demandPublish.DemandID,
                            RecordID = Guid.NewGuid(),
                            Created = DateTime.Now,
                            ApplyType = SISPIncubatorOnlineEnum.ApplyType.DemandApply.GetHashCode().ToString(),
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
                   "[DemandPublishManager Method(UpdateDemandPublish): DemandPublish is null]未查询到活动信息！");
                }
            }
            else
            {
                throw new BadRequestException(
                    "[DemandPublishManager Method(UpdateDemandPublish): DemandPublishUpdateRequest is null]未获取到提交的活动信息！");
            }
        }

        /// <summary>
        /// 删除需求发布表
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public void DeleteDemandPublish(Guid id)
        {
            var demandPublish = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.FirstOrDefault(x => x.DemandID == id);
            if (demandPublish != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Remove(demandPublish);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[DemandPublishManager Method(DeleteDemandPublish): DemandPublish is null id=" + id + "]未查询到活动信息！");
            }
        }

        /// <summary>
        /// 根据查询条件查询需求发布表
        /// </summary>
        /// <param name="conditions">多条件</param>
        /// <returns></returns>
        public DemandPublishResponse GetAll(DemandPublishRequest conditions)
        {
            DemandPublishResponse demandPublishResponse = new DemandPublishResponse();
            IQueryable<DemandPublishDTO> demandPublishs;
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            //查询条件是否为空
            if (conditions != null)
            {
                conditions.ExpiryDate = DateTime.Now;

                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                //搜条件是否为空
                if (string.IsNullOrEmpty(conditions.SearchString))
                {
                    demandPublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                      join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                      where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                      orderby a.Created descending
                                      select new DemandPublishDTO()
                                      {
                                          DemandID = a.DemandID,
                                          CompanyName = a.CompanyName,
                                          Contacts = a.Contacts,
                                          Mobile = a.Mobile,
                                          Email = a.Email,
                                          FoundedTime = a.FoundedTime,
                                          Members = a.Members,
                                          ProjectDescription = a.ProjectDescription,
                                          DemandDescription = a.DemandDescription,
                                          IntentionPartner = a.IntentionPartner,
                                          Category=a.Category,
                                          Status = a.Status,
                                          ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                      }).Skip(pageSize * pageIndex)
                                               .Take(pageSize);
                }
                else
                {

                    demandPublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                      join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                      where a.Status == approvedStatus && (a.CompanyName.Contains(conditions.SearchString) || a.Category.Contains(conditions.SearchString))
                                      && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                      orderby a.Created descending
                                      select new DemandPublishDTO()
                                      {
                                          DemandID = a.DemandID,
                                          CompanyName = a.CompanyName,
                                          Contacts = a.Contacts,
                                          Mobile = a.Mobile,
                                          Email = a.Email,
                                          FoundedTime = a.FoundedTime,
                                          Members = a.Members,
                                          ProjectDescription = a.ProjectDescription,
                                          DemandDescription = a.DemandDescription,
                                          IntentionPartner = a.IntentionPartner,
                                          Category = a.Category,
                                          Status = a.Status,
                                          ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                      }).Skip(pageSize * pageIndex)
                                .Take(pageSize);

                }
            }
            else
            {

                demandPublishs = from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                 where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= DateTime.Now)
                                 orderby a.Created descending
                                 select new DemandPublishDTO()
                                      {
                                          DemandID = a.DemandID,
                                          CompanyName = a.CompanyName,
                                          Contacts = a.Contacts,
                                          Mobile = a.Mobile,
                                          Email = a.Email,
                                          FoundedTime = a.FoundedTime,
                                          Members = a.Members,
                                          ProjectDescription = a.ProjectDescription,
                                          DemandDescription = a.DemandDescription,
                                          IntentionPartner = a.IntentionPartner,
                                          Category = a.Category,
                                          Status = a.Status,
                                          ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                      };
            }
            var list = demandPublishs.ToList<DemandPublishDTO>();
            demandPublishResponse.Results = list;
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                demandPublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == approvedStatus && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }
            else
            {
                demandPublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == approvedStatus && (x.CompanyName.Contains(conditions.SearchString) || x.Category.Contains(conditions.SearchString)) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                demandPublishResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                demandPublishResponse.TotalPage = (demandPublishResponse.TotalCount + size - 1) / size;
            }
            return demandPublishResponse;
        }

        public DemandPublishResponse GetAllByAnonymous(DemandPublishRequest conditions)
        {
            DemandPublishResponse demandPublishResponse = new DemandPublishResponse();
            IQueryable<DemandPublishDTO> demandPublishs;
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            //查询条件是否为空
            if (conditions != null)
            {
                conditions.ExpiryDate = DateTime.Now;

                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                //搜条件是否为空
                if (string.IsNullOrEmpty(conditions.SearchString))
                {
                    demandPublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                      join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                      where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                      orderby a.Created descending
                                      select new DemandPublishDTO()
                                      {
                                          DemandID = a.DemandID,
                                          CompanyName = a.CompanyName,
                                          Contacts = a.Contacts,
                                          Mobile = string.Empty,
                                          Email = string.Empty,
                                          FoundedTime = a.FoundedTime,
                                          Members = a.Members,
                                          ProjectDescription = a.ProjectDescription,
                                          DemandDescription = a.DemandDescription,
                                          IntentionPartner = a.IntentionPartner,
                                          Category = a.Category,
                                          Status = a.Status,
                                          ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                      }).Skip(pageSize * pageIndex)
                                               .Take(pageSize);
                }
                else
                {

                    demandPublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                      join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                      where a.Status == approvedStatus && (a.CompanyName.Contains(conditions.SearchString) || a.Category.Contains(conditions.SearchString))
                                      && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                      orderby a.Created descending
                                      select new DemandPublishDTO()
                                      {
                                          DemandID = a.DemandID,
                                          CompanyName = a.CompanyName,
                                          Contacts = a.Contacts,
                                          Mobile = string.Empty,
                                          Email = string.Empty,
                                          FoundedTime = a.FoundedTime,
                                          Members = a.Members,
                                          ProjectDescription = a.ProjectDescription,
                                          DemandDescription = a.DemandDescription,
                                          IntentionPartner = a.IntentionPartner,
                                          Category = a.Category,
                                          Status = a.Status,
                                          ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                      }).Skip(pageSize * pageIndex)
                                .Take(pageSize);

                }
            }
            else
            {

                demandPublishs = from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                 where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= DateTime.Now)
                                 orderby a.Created descending
                                 select new DemandPublishDTO()
                                 {
                                     DemandID = a.DemandID,
                                     CompanyName = a.CompanyName,
                                     Contacts = a.Contacts,
                                     Mobile = string.Empty,
                                     Email = string.Empty,
                                     FoundedTime = a.FoundedTime,
                                     Members = a.Members,
                                     ProjectDescription = a.ProjectDescription,
                                     DemandDescription = a.DemandDescription,
                                     IntentionPartner = a.IntentionPartner,
                                     Category = a.Category,
                                     Status = a.Status,
                                     ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                 };
            }
            var list = demandPublishs.ToList<DemandPublishDTO>();
            demandPublishResponse.Results = list;
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                demandPublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == approvedStatus && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }
            else
            {
                demandPublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == approvedStatus && (x.CompanyName.Contains(conditions.SearchString) || x.Category.Contains(conditions.SearchString)) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                demandPublishResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                demandPublishResponse.TotalPage = (demandPublishResponse.TotalCount + size - 1) / size;
            }
            return demandPublishResponse;
        }
        public BiddingResponse GetAll()
        {
            DemandPublishRequest conditions = new DemandPublishRequest();
            conditions.ExpiryDate = DateTime.Now;

            BiddingResponse biddingResponse = new BiddingResponse();
            int demandPublishCode = SISPIncubatorOnlineEnum.BiddingCategory.DemandPublish.GetHashCode();
            int servicePublishCode = SISPIncubatorOnlineEnum.BiddingCategory.Service.GetHashCode();
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            var demandPublishs = from a in SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish
                                 //join b in SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord on a.DemandID equals b.ApproveRelateID
                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                 where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                     // && b.ApproveResult == approvedStatus 
                                 && a.IsShow == true
                                 orderby a.Created descending
                                 select new BiddingDTO
                                 {
                                     ID = a.DemandID,
                                     CompanyName = a.CompanyName,
                                     Industry = string.Empty,
                                     Description = a.ProjectDescription,
                                     Category = demandPublishCode,
                                     ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                 };
            var services = from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                           //join b in SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord on a.ServiceID equals b.ApproveRelateID
                           where a.Status == approvedStatus
                               //&& b.ApproveResult == approvedStatus 
                           && a.IsShow == true && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                           join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                           orderby a.Created descending
                           select new BiddingDTO
                           {
                               ID = a.ServiceID,
                               CompanyName = a.CompanyName,
                               Industry = a.Industry,
                               Description = a.Description,
                               Category = servicePublishCode,
                               ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                           };
            var demandPublishList = demandPublishs.ToList<BiddingDTO>();
            var serviceList = services.ToList<BiddingDTO>();
            biddingResponse.Results = new List<BiddingDTO>();
            foreach (var demandPublish in demandPublishList)
            {
                biddingResponse.Results.Add(demandPublish);
            }
            foreach (var service in serviceList)
            {
                DictionaryManager dm = new DictionaryManager();
                List<Dictionary> dlist = dm.GetAllByIDS(service.Industry);
                string industry = string.Empty;
                foreach (Dictionary dictionary in dlist)
                {
                    industry += dictionary.Value + ",";
                }
                service.IndustryName = industry.TrimEnd(',');
                biddingResponse.Results.Add(service);
            }
            return biddingResponse;
        }

        public DemandPublishResponse GetMyAllDemands(DemandPublishRequest conditions)
        {
            DemandPublishResponse demandPublishResponse = new DemandPublishResponse();
            List<DemandPublish> demandPublishs = new List<DemandPublish>();
            User user = UserHelper.CurrentUser;
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            conditions.ExpiryDate = DateTime.Now;

            //搜条件是否为空
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.CreatedBy == user.UserID && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created).Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();
            }
            else
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.CreatedBy == user.UserID && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created).Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();
            }
            List<DemandPublishDTO> dtoList = new List<DemandPublishDTO>();
            Utility.CopyList<DemandPublish, DemandPublishDTO>(demandPublishs, dtoList);
            demandPublishResponse.Results = dtoList;
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                demandPublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.CreatedBy == user.UserID).Count();
            }
            else
            {
                demandPublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.CreatedBy == user.UserID && x.CompanyName.Contains(conditions.SearchString)).Count();
            }

            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                demandPublishResponse.TotalPage = 1;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                demandPublishResponse.TotalPage = (demandPublishResponse.TotalCount + size - 1) / size;
            }
            return demandPublishResponse;
        }

        public DemandPublishResponse GetAllDemandPublish(DemandPublishRequest conditions)
        {
            DemandPublishResponse demandPublishResponse = new DemandPublishResponse();
            IQueryable<DemandPublish> demandPublishs;
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            string pendingStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            string dismissedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode());
            string revokeStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode());

            conditions.ExpiryDate = DateTime.Now;
            if (conditions.Status == Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.All.GetHashCode()))
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == pendingStatus)
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == pendingStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == dismissedStatus)
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == dismissedStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == revokeStatus)
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == revokeStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else
            {
                demandPublishs = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.Status == approvedStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            demandPublishResponse.TotalCount = demandPublishs.Count();
            var demandPublishList = demandPublishs.Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();
            List<DemandPublishDTO> dtoList = new List<DemandPublishDTO>();
            Utility.CopyList<DemandPublish, DemandPublishDTO>(demandPublishList, dtoList);
            demandPublishResponse.Results = dtoList.ToList();


            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                demandPublishResponse.TotalPage = 1;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                demandPublishResponse.TotalPage = (demandPublishResponse.TotalCount + size - 1) / size;
            }
            return demandPublishResponse;
        }

        public void UpdateDemandStatusAndApprove(DemandPublishApproveRequest demandPublishApproveRequest)
        {
            User user = UserHelper.CurrentUser;
            ApproveRecord approveRecord = new ApproveRecord();
            MessageManager messageManager = new MessageManager();
            //审批记录
            approveRecord.ApproveRelateID = demandPublishApproveRequest.Id;
            approveRecord.RecordID = Guid.NewGuid();
            approveRecord.Created = DateTime.Now;
            var activity = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.DemandID == demandPublishApproveRequest.Id).FirstOrDefault();
            activity.Status = demandPublishApproveRequest.ApproveStatus;
            approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.DemandApply.GetHashCode().ToString();
            approveRecord.Applicant = user.UserID;
            // ReSharper disable once ConvertConditionalTernaryToNullCoalescing
            approveRecord.Comments = demandPublishApproveRequest.Comments;
            approveRecord.Approver = user.UserID;
            if (demandPublishApproveRequest.ApproveStatus == "2")
            {
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                approveRecord.ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                messageManager.CreateSystemMessage(activity.CreatedBy.ToString(), "您的需求发布申请审批已审批通过！");
            }
            else
            {
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                approveRecord.ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                messageManager.CreateSystemMessage(activity.CreatedBy.ToString(), "您的需求发布申请审批已驳回，请查看详情！");
            }

            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        public void RemoveDemandRecord(DemandPublishApproveRequest demandPublishApproveRequest)
        {
            var approvedRecords = SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Where(x => x.ApproveRelateID == demandPublishApproveRequest.Id).ToList();
            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.RemoveRange(approvedRecords);
            var activity = SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(x => x.DemandID == demandPublishApproveRequest.Id).FirstOrDefault();
            SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Remove(activity);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        private void DemandPublishDTOToDemandPublish(DemandPublish demandPublishDto, DemandPublish demandPublish, bool isAdmin)
        {
            if (!isAdmin)
            {
                demandPublish.Status = demandPublishDto.Status;
            }
            demandPublish.CompanyName = demandPublishDto.CompanyName;
            demandPublish.Contacts = demandPublishDto.Contacts;
            demandPublish.DemandDescription = demandPublishDto.DemandDescription;
            demandPublish.Email = demandPublishDto.Email;
            demandPublish.FoundedTime = demandPublishDto.FoundedTime;
            demandPublish.IntentionPartner = demandPublishDto.IntentionPartner;
            demandPublish.Members = demandPublishDto.Members;
            demandPublish.ProjectDescription = demandPublishDto.ProjectDescription;
            demandPublish.IsShow = demandPublishDto.IsShow;
            demandPublish.ExpiryDate = demandPublishDto.ExpiryDate;

        }

    }
}