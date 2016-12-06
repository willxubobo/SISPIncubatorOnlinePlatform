using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System.Configuration;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class ServicePublishManager : BaseManager
    {
        string serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];

        /// <summary>
        /// 根据id获取服务发布列表
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        public ServicePublishResponse GetServicePublishByGuid(Guid id)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            var servicePublish =
                SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.ServiceID == id).ToList();
            List<ServicePublishDTO> dtoList = new List<ServicePublishDTO>();
            Utility.CopyList<ServicePublish, ServicePublishDTO>(servicePublish, dtoList);
            DictionaryManager dm = new DictionaryManager();
            List<Dictionary> dlist = dm.GetAllByIDS(dtoList[0].Industry);
            string industry = string.Empty;
            foreach (Dictionary dictionary in dlist)
            {
                industry += dictionary.Value + ",";
            }
            dtoList[0].IndustryName = industry.TrimEnd(',');
            foreach (var list in dtoList)
            {
                string img = SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Where(x => x.UserID == list.CreatedBy).Select(x => x.Headimgurl).FirstOrDefault();
                if (!string.IsNullOrEmpty(img))
                {
                    if (!img.Contains("http"))
                    {
                        list.ImgUrl = serviceUrl + img;
                    }
                    else
                    {
                        list.ImgUrl = img;
                    }
                }
                else
                {
                    list.ImgUrl = string.Empty;
                }
            }
            servicePublishResponse.Results = dtoList;
            return servicePublishResponse;
        }

        public ServicePublishResponse GetServicePublishByAnonymous(Guid id)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            var servicePublish =
                SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.ServiceID == id).ToList();
            List<ServicePublishDTO> dtoList = new List<ServicePublishDTO>();
            Utility.CopyList<ServicePublish, ServicePublishDTO>(servicePublish, dtoList);
            DictionaryManager dm = new DictionaryManager();
            List<Dictionary> dlist = dm.GetAllByIDS(dtoList[0].Industry);
            string industry = string.Empty;
            foreach (Dictionary dictionary in dlist)
            {
                industry += dictionary.Value + ",";
            }
            dtoList[0].IndustryName = industry.TrimEnd(',');
            foreach (var list in dtoList)
            {
                string img = SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Where(x => x.UserID == list.CreatedBy).Select(x => x.Headimgurl).FirstOrDefault();
                if (!string.IsNullOrEmpty(img))
                {
                    if (!img.Contains("http"))
                    {
                        list.ImgUrl = serviceUrl + img;
                    }
                    else
                    {
                        list.ImgUrl = img;
                    }
                }
                else
                {
                    list.ImgUrl = string.Empty;
                }
                list.Email = string.Empty;
                list.PhoneNumber = string.Empty;
            }
            servicePublishResponse.Results = dtoList;
            return servicePublishResponse;
        }

        /// <summary>
        /// 创建孵化器活动申请列表
        /// </summary>
        /// <param name="servicePublishDto"></param>
        /// <returns></returns>
        public ServicePublishResponse CreateServicePublish(ServicePublishCreateRequest servicePublishDto)
        {
            var servicePublishResponse = new ServicePublishResponse();
            if (servicePublishDto != null)
            {
                User user = UserHelper.CurrentUser;
                var servicePublish = servicePublishDto.ServicePublish;
                var serviceId = Guid.NewGuid();
                servicePublish.CreatedBy = user.UserID;
                servicePublish.ServiceID = serviceId;
                servicePublish.Created = DateTime.Now;
                if (servicePublishDto.IsAdmin)
                {
                    servicePublish.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
                }
                else
                {
                    servicePublish.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
                }

                SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Add(servicePublish);
                if (servicePublishDto.IsAdmin)
                {
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord
                    {
                        ApproveRelateID = serviceId,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.ServiceApply.GetHashCode().ToString(),
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
                        ApproveRelateID = serviceId,
                        RecordID = Guid.NewGuid(),
                        Created = DateTime.Now,
                        ApplyType = SISPIncubatorOnlineEnum.ApplyType.ServiceApply.GetHashCode().ToString(),
                        ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
                        Applicant = user.UserID,
                        Approver = user.UserID
                    };
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                }


                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                servicePublishResponse.Id = servicePublish.ServiceID;
            }
            else
            {
                throw new BadRequestException("[ServicePublishManager Method(CreateServicePublish): ServicePublishCreateRequest is null]未获取到提交的活动信息！");
            }
            return servicePublishResponse;
        }

        public ServicePublishResponse RevokeServicePublish(ServicePublishCreateRequest servicePublishDto)
        {
            var servicePublishResponse = new ServicePublishResponse();
            ServicePublish servicePublish = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.FirstOrDefault(p => p.ServiceID == servicePublishDto.ServicePublish.ServiceID);
            if (servicePublish != null)
            {
                servicePublish.Status = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                servicePublishResponse.Id = servicePublish.ServiceID;
            }
            User user = UserHelper.CurrentUser;
            //审批记录
            ApproveRecord approveRecord = new ApproveRecord();
            approveRecord.ApproveRelateID = servicePublish.ServiceID;
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
            return servicePublishResponse;
        }

        /// <summary>
        /// 更新服务发布表数据
        /// </summary>
        /// <param name="servicePublishDto"></param>
        /// <returns></returns>
        public void UpdateServicePublish(ServicePublishUpdateRequest servicePublishDto)
        {
            if (servicePublishDto != null)
            {

                var servicePublish =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.FirstOrDefault(
                        x => x.ServiceID == servicePublishDto.ServicePublish.ServiceID);
                if (servicePublish != null)
                {
                    User user = UserHelper.CurrentUser;
                    ServicePublishDTOToServicePublish(servicePublishDto.ServicePublish,
                        servicePublish, servicePublishDto.IsAdmin);
                    if (!servicePublishDto.IsAdmin)
                    {
                        //审批记录
                        ApproveRecord approveRecord = new ApproveRecord
                        {
                            ApproveRelateID = servicePublish.ServiceID,
                            RecordID = Guid.NewGuid(),
                            Created = DateTime.Now,
                            ApplyType = SISPIncubatorOnlineEnum.ApplyType.ServiceApply.GetHashCode().ToString(),
                            ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString(),
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
                   "[ServicePublishManager Method(UpdateServicePublish): ServicePublish is null]未查询到活动信息！");
                }
            }
            else
            {
                throw new BadRequestException(
                    "[ServicePublishManager Method(UpdateServicePublish): ServicePublishUpdateRequest is null]未获取到提交的活动信息！");
            }
        }

        /// <summary>
        /// 根据ID删除服务发布列表对应数据
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public void DeleteServicePublish(Guid id)
        {
            var servicePublish = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.FirstOrDefault(x => x.ServiceID == id);
            if (servicePublish != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Remove(servicePublish);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[ServicePublishManager Method(DeleteServicePublish): ServicePublish is null id=" + id + "]未查询到活动信息！");
            }
        }

        /// <summary>
        /// 根据查询条件查询服务发布列表数据
        /// </summary>
        /// <param name="conditions">多条件</param>
        /// <returns></returns>
        public ServicePublishResponse GetAll(ServicePublishRequest conditions)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            IQueryable<ServicePublishDTO> servicePublishs;
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

                    servicePublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                                       join b in SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord on a.ServiceID equals b.ApproveRelateID
                                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                       where a.Status == approvedStatus && b.ApproveResult == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                       orderby b.Created descending
                                       select new ServicePublishDTO()
                                      {
                                          ServiceID = a.ServiceID,
                                          CompanyName = a.CompanyName,
                                          Industry = a.Industry,
                                          Address = a.Address,
                                          Email = a.Email,
                                          Description = a.Description,
                                          Category = a.Category,
                                          PhoneNumber = a.PhoneNumber,
                                          Status = a.Status,
                                          ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                      }).Skip(pageSize * pageIndex)
                                               .Take(pageSize);

                }
                else
                {
                    servicePublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                                       join b in SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord on a.ServiceID equals b.ApproveRelateID
                                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                       where a.Status == approvedStatus && b.ApproveResult == approvedStatus && (a.CompanyName.Contains(conditions.SearchString) || a.Category.Contains(conditions.SearchString))
                                       && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                       orderby b.Created descending
                                       select new ServicePublishDTO()
                                       {
                                           ServiceID = a.ServiceID,
                                           CompanyName = a.CompanyName,
                                           Industry = a.Industry,
                                           Address = a.Address,
                                           Email = a.Email,
                                           Description = a.Description,
                                           Category = a.Category,
                                           PhoneNumber = a.PhoneNumber,
                                           Status = a.Status,
                                           ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                       }).Skip(pageSize * pageIndex)
                                .Take(pageSize);

                }
            }
            else
            {

                servicePublishs = from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                                  join b in SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord on a.ServiceID equals b.ApproveRelateID
                                  join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                  where a.Status == approvedStatus && b.ApproveResult == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= DateTime.Now)
                                  orderby b.Created descending
                                  select new ServicePublishDTO()
                                  {
                                      ServiceID = a.ServiceID,
                                      CompanyName = a.CompanyName,
                                      Industry = a.Industry,
                                      Address = a.Address,
                                      Email = a.Email,
                                      Description = a.Description,
                                      Category = a.Category,
                                      PhoneNumber = a.PhoneNumber,
                                      Status = a.Status,
                                      ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                  };
            }
            var list = servicePublishs.ToList();
            foreach (var service in list)
            {
                DictionaryManager dm = new DictionaryManager();
                List<Dictionary> dlist = dm.GetAllByIDS(service.Industry);
                string industry = string.Empty;
                foreach (Dictionary dictionary in dlist)
                {
                    industry += dictionary.Value + ",";
                }
                service.IndustryName = industry.TrimEnd(',');
            }
            servicePublishResponse.Results = list;
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                servicePublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == approvedStatus && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }
            else
            {
                servicePublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == approvedStatus && (x.CompanyName.Contains(conditions.SearchString) || x.Category.Contains(conditions.SearchString)) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }

            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                servicePublishResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                servicePublishResponse.TotalPage = (servicePublishResponse.TotalCount + size - 1) / size;
            }

            return servicePublishResponse;
        }

        public ServicePublishResponse GetAllByAnonymous(ServicePublishRequest conditions)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            IQueryable<ServicePublishDTO> servicePublishs;
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

                    servicePublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                       where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                       orderby a.Created descending
                                       select new ServicePublishDTO()
                                       {
                                           ServiceID = a.ServiceID,
                                           CompanyName = a.CompanyName,
                                           Industry = a.Industry,
                                           Address = a.Address,
                                           Email = string.Empty,
                                           Description = a.Description,
                                           Category = a.Category,
                                           PhoneNumber = string.Empty,
                                           Status = a.Status,
                                           ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                       }).Skip(pageSize * pageIndex)
                                               .Take(pageSize);

                }
                else
                {
                    servicePublishs = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                       where a.Status == approvedStatus && (a.CompanyName.Contains(conditions.SearchString) || a.Category.Contains(conditions.SearchString))
                                       && (a.ExpiryDate == null ? true : a.ExpiryDate >= conditions.ExpiryDate)
                                       orderby a.Created descending
                                       select new ServicePublishDTO()
                                       {
                                           ServiceID = a.ServiceID,
                                           CompanyName = a.CompanyName,
                                           Industry = a.Industry,
                                           Address = a.Address,
                                           Email = string.Empty,
                                           Description = a.Description,
                                           Category = a.Category,
                                           PhoneNumber = string.Empty,
                                           Status = a.Status,
                                           ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                       }).Skip(pageSize * pageIndex)
                                .Take(pageSize);

                }
            }
            else
            {

                servicePublishs = from a in SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish
                                  join c in SISPIncubatorOnlinePlatformEntitiesInstance.WeChat on a.CreatedBy equals c.UserID
                                  where a.Status == approvedStatus && (a.ExpiryDate == null ? true : a.ExpiryDate >= DateTime.Now)
                                  orderby a.Created descending
                                  select new ServicePublishDTO()
                                  {
                                      ServiceID = a.ServiceID,
                                      CompanyName = a.CompanyName,
                                      Industry = a.Industry,
                                      Address = a.Address,
                                      Email = string.Empty,
                                      Description = a.Description,
                                      Category = a.Category,
                                      PhoneNumber = string.Empty,
                                      Status = a.Status,
                                      ImgUrl = c.Headimgurl.Contains("http") ? c.Headimgurl : serviceUrl + c.Headimgurl
                                  };
            }
            var list = servicePublishs.ToList();
            foreach (var service in list)
            {
                DictionaryManager dm = new DictionaryManager();
                List<Dictionary> dlist = dm.GetAllByIDS(service.Industry);
                string industry = string.Empty;
                foreach (Dictionary dictionary in dlist)
                {
                    industry += dictionary.Value + ",";
                }
                service.IndustryName = industry.TrimEnd(',');
            }
            servicePublishResponse.Results = list;
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                servicePublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == approvedStatus && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }
            else
            {
                servicePublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == approvedStatus && (x.CompanyName.Contains(conditions.SearchString) || x.Category.Contains(conditions.SearchString)) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).Count();
            }

            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                servicePublishResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                servicePublishResponse.TotalPage = (servicePublishResponse.TotalCount + size - 1) / size;
            }

            return servicePublishResponse;
        }

        public ServicePublishResponse GetMyAllServices(ServicePublishRequest conditions)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            List<ServicePublish> servicePublishs = new List<ServicePublish>();
            User user = UserHelper.CurrentUser;
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);

            conditions.ExpiryDate = DateTime.Now;
            //搜条件是否为空
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.CreatedBy == user.UserID && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created).Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();

            }
            else
            {

                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.CreatedBy == user.UserID && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created).Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();
            }
            List<ServicePublishDTO> dtoList = new List<ServicePublishDTO>();
            Utility.CopyList<ServicePublish, ServicePublishDTO>(servicePublishs, dtoList);
            foreach (var service in dtoList)
            {
                DictionaryManager dm = new DictionaryManager();
                List<Dictionary> dlist = dm.GetAllByIDS(service.Industry);
                string industry = string.Empty;
                foreach (Dictionary dictionary in dlist)
                {
                    industry += dictionary.Value + ",";
                }
                service.IndustryName = industry.TrimEnd(',');
            }

            servicePublishResponse.Results = dtoList;
            if (string.IsNullOrEmpty(conditions.SearchString))
            {
                servicePublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.CreatedBy == user.UserID).Count();
            }
            else
            {
                servicePublishResponse.TotalCount = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.CreatedBy == user.UserID && x.CompanyName.Contains(conditions.SearchString)).Count();
            }

            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                servicePublishResponse.TotalPage = 1;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                servicePublishResponse.TotalPage = (servicePublishResponse.TotalCount + size - 1) / size;
            }
            return servicePublishResponse;
        }

        public ServicePublishResponse GetAllServicePublish(ServicePublishRequest conditions)
        {
            ServicePublishResponse servicePublishResponse = new ServicePublishResponse();
            IQueryable<ServicePublish> servicePublishs;
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            string pendingStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            string dismissedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode());
            string revokeStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode());
            conditions.ExpiryDate = DateTime.Now;

            if (conditions.Status == Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.All.GetHashCode()))
            {
                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == pendingStatus)
            {
                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == pendingStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == dismissedStatus)
            {
                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == dismissedStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else if (conditions.Status == revokeStatus)
            {
                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == revokeStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            else
            {
                servicePublishs = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.Status == approvedStatus && x.CompanyName.Contains(conditions.SearchString) && (x.ExpiryDate == null ? true : x.ExpiryDate >= conditions.ExpiryDate)).OrderByDescending(x => x.Created);
            }
            servicePublishResponse.TotalCount = servicePublishs.Count();
            var servicePublishList = servicePublishs.Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();
            List<ServicePublishDTO> dtoList = new List<ServicePublishDTO>();
            Utility.CopyList<ServicePublish, ServicePublishDTO>(servicePublishList, dtoList);
            servicePublishResponse.Results = dtoList.ToList();


            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                servicePublishResponse.TotalPage = 1;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                servicePublishResponse.TotalPage = (servicePublishResponse.TotalCount + size - 1) / size;
            }
            return servicePublishResponse;
        }

        public void UpdateServiceStatusAndApprove(ServicePublishApproveRequest ServicePublishApproveRequest)
        {
            User user = UserHelper.CurrentUser;
            ApproveRecord approveRecord = new ApproveRecord();
            MessageManager messageManager = new MessageManager();
            //审批记录
            approveRecord.ApproveRelateID = ServicePublishApproveRequest.Id;
            approveRecord.RecordID = Guid.NewGuid();
            approveRecord.Created = DateTime.Now;
            var activity = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.ServiceID == ServicePublishApproveRequest.Id).FirstOrDefault();
            activity.Status = ServicePublishApproveRequest.ApproveStatus;
            approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.ServiceApply.GetHashCode().ToString();
            approveRecord.Applicant = user.UserID;
            // ReSharper disable once ConvertConditionalTernaryToNullCoalescing
            approveRecord.Comments = ServicePublishApproveRequest.Comments;
            approveRecord.Approver = user.UserID;

            if (ServicePublishApproveRequest.ApproveStatus == "2")
            {
                approveRecord.ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                messageManager.CreateSystemMessage(activity.CreatedBy.ToString(), "您的服务发布申请审批已审批通过！");
            }
            else
            {
                approveRecord.ApproveResult = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                messageManager.CreateSystemMessage(activity.CreatedBy.ToString(), "您的服务发布申请审批已驳回，请查看详情！");
            }

            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        public void RemoveServiceRecord(ServicePublishApproveRequest ServicePublishApproveRequest)
        {
            var approvedRecords = SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Where(x => x.ApproveRelateID == ServicePublishApproveRequest.Id).ToList();
            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.RemoveRange(approvedRecords);
            var activity = SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(x => x.ServiceID == ServicePublishApproveRequest.Id).FirstOrDefault();
            SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Remove(activity);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        private void ServicePublishDTOToServicePublish(ServicePublish servicePublishDto, ServicePublish servicePublish, bool isAdmin)
        {
            servicePublish.Address = servicePublishDto.Address;
            servicePublish.CompanyName = servicePublishDto.CompanyName;
            servicePublish.PhoneNumber = servicePublishDto.PhoneNumber;
            servicePublish.Email = servicePublishDto.Email;
            servicePublish.Industry = servicePublishDto.Industry;
            servicePublish.Description = servicePublishDto.Description;
            servicePublish.Category = servicePublishDto.Category;
            if (!isAdmin)
            {
                servicePublish.Status = servicePublishDto.Status;
            }
            servicePublish.IsShow = servicePublishDto.IsShow;
            servicePublish.ExpiryDate = servicePublishDto.ExpiryDate;
        }

    }
}