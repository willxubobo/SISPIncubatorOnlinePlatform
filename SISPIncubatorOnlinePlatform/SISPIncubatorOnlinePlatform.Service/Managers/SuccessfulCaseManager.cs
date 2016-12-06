using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class SuccessfulCaseManager:BaseManager
    {
        /// <summary>
        /// 创建成功案例信息
        /// </summary>
        /// <param name="successfulCaseCreateRequest"></param>
        /// <returns></returns>
        public Guid CreateSuccessfulCase(SuccessfulCaseCreateRequest successfulCaseCreateRequest)
        {
            SuccessfulCase successfulCase = successfulCaseCreateRequest.SuccessfulCase;
            if (successfulCase != null)
            {
                User user = UserHelper.CurrentUser;
                successfulCase.CreatedBy = user.UserID;
                successfulCase.Created = DateTime.Now;
                successfulCase.Status = true;
                successfulCase.CaseID = Guid.NewGuid();
                SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase.Add(successfulCase);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[SuccessfulCaseManager Method(CreateSuccessfulCase): successfulCaseCreateRequest is null]未获取到要创建的数据！");
            }
            return successfulCase.CaseID;
        }

        /// <summary>
        /// 根据主键获取成功案例信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<SuccessfulCaseDTO> GetSuccessfulCaseById(Guid id)
        {
            List<SuccessfulCaseDTO> list = new List<SuccessfulCaseDTO>();
            list = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase
                    join b in SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary
                    on a.Category equals b.ID
                    where a.CaseID == id
                    orderby a.Created descending
                    select new SuccessfulCaseDTO
                    {
                        CaseID = a.CaseID,
                        Category = b.Value,
                        Content = a.Content,
                        Picture = a.Picture,
                        Title = a.Title,
                        Created = a.Created,
                        CreatedBy = a.CreatedBy,
                        Status = a.Status
                    }).ToList();
            return list;
        }

        /// <summary>
        /// 根据查询条件获取所有成功案例信息
        /// </summary>
        /// <returns></returns>
        public SuccessfulCaseResponse GetAll(SuccessfulCaseRequest conditions)
        {
            SuccessfulCaseResponse successfulCaseResponse = new SuccessfulCaseResponse();
            List<SuccessfulCaseDTO> list = new List<SuccessfulCaseDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                if (conditions.Status == Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.All.GetHashCode()))
                {
                    list = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase
                            join b in SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary
                            on a.Category equals b.ID
                            orderby a.Created descending
                            select new SuccessfulCaseDTO
                            {
                                CaseID = a.CaseID,
                                Category = b.Value,
                                Content = a.Content,
                                Picture = a.Picture,
                                Title = a.Title,
                                Created = a.Created,
                                CreatedBy = a.CreatedBy,
                                Status = a.Status
                            }).Where(x => x.Title.Contains(conditions.SearchString)).Skip(pageSize * pageIndex).Take(pageSize).ToList();
                    successfulCaseResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase
                                                         join b in SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary
                                                         on a.Category equals b.ID
                                                         orderby a.Created descending
                                                         select new SuccessfulCaseDTO
                                                         {
                                                             CaseID = a.CaseID,
                                                             Category = b.Value,
                                                             Content = a.Content,
                                                             Picture = a.Picture,
                                                             Title = a.Title,
                                                             Created = a.Created,
                                                             CreatedBy = a.CreatedBy,
                                                             Status = a.Status
                                                         }).Where(x => x.Title.Contains(conditions.SearchString)).ToList().Count();
                }
                else
                {
                    list = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase
                            join b in SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary
                            on a.Category equals b.ID
                            where a.Status == true
                            orderby a.Created descending
                            select new SuccessfulCaseDTO
                            {
                                CaseID = a.CaseID,
                                Category = b.Value,
                                Content = a.Content,
                                Picture = a.Picture,
                                Title = a.Title,
                                Created = a.Created,
                                CreatedBy = a.CreatedBy,
                                Status = a.Status
                            }).Where(x => x.Title.Contains(conditions.SearchString)).Skip(pageSize * pageIndex).Take(pageSize).ToList();
                    successfulCaseResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase
                                                         join b in SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary
                                                         on a.Category equals b.ID
                                                         where a.Status == true
                                                         orderby a.Created descending
                                                         select new SuccessfulCaseDTO
                                                         {
                                                             CaseID = a.CaseID,
                                                             Category = b.Value,
                                                             Content = a.Content,
                                                             Picture = a.Picture,
                                                             Title = a.Title,
                                                             Created = a.Created,
                                                             CreatedBy = a.CreatedBy,
                                                             Status = a.Status
                                                         }).Where(x => x.Title.Contains(conditions.SearchString)).ToList().Count();
                }
                successfulCaseResponse.Results = list;
                //目前还缺少查询的条件
            }
            return successfulCaseResponse;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="successfulCaseCreateRequest"></param>
        /// <returns></returns>
        public void UpdateSuccessfulCase(SuccessfulCaseCreateRequest successfulCaseCreateRequest)
        {
            if (successfulCaseCreateRequest.SuccessfulCase == null)
            {
                throw new BadRequestException("[SuccessfulCaseManager Method(UpdateSuccessfulCase): SuccessfulCase is null]未获取到要更新的数据！");
            }
            SuccessfulCase updatemodel = successfulCaseCreateRequest.SuccessfulCase;
            SuccessfulCase model = SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase.FirstOrDefault(m => m.CaseID == updatemodel.CaseID);
            if (model != null)
            {
                GetModel(model, updatemodel);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[SuccessfulCaseManager Method(UpdateSuccessfulCase): 未获取到要更新的SuccessfulCase信息]未获取到要更新的数据！");
            }
        }

        /// <summary>
        /// 根据主键删除数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void DeleteSuccessfulCase(Guid id)
        {
            SuccessfulCase successfulCase = SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase.FirstOrDefault(m => m.CaseID == id);
            if (successfulCase != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.SuccessfulCase.Remove(successfulCase);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges()<= 0)
                {
                    throw new BadRequestException("[SuccessfulCaseManager Method(DeleteSuccessfulCase): 删除提交失败id=" + id+"]删除提交失败！");
                }
            }
            else
            {
                throw new BadRequestException("[SuccessfulCaseManager Method(DeleteSuccessfulCase): 未获取到要删除的SuccessfulCase信息id="+id+"]未获取到要删除的数据！");
            }
        }

        private SuccessfulCase GetModel(SuccessfulCase model, SuccessfulCase successfulCase)
        {
            if (successfulCase != null)
            {
                model.Category = successfulCase.Category;
                model.Content = successfulCase.Content;
                model.Picture = successfulCase.Picture;
                model.Title = successfulCase.Title;
                model.Status = successfulCase.Status;
                return model;
            }
            else
            {
                return null;
            }
        }
    }
}