using log4net;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class FinancingRequirementsManager : BaseManager
    {
        /// <summary>
        /// 根据查询条件获取所有融资需求信息
        /// </summary>
        /// <returns></returns>
        public List<FinancingRequirementsDTO> GetAll(FinancingRequirementsRequest conditions, out int TotalRecords, out int TotalPage)
        {
            List<FinancingRequirementsDTO> list = new List<FinancingRequirementsDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                if (!string.IsNullOrEmpty(conditions.ApproveList) && conditions.ApproveList == "true")
                {
                    string keyWord = conditions.KeyWord;
                    string approvestatus = conditions.Status;
                    List<FinancingRequirements> tempList =
                        SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Where(
                            d => d.Status.Contains(approvestatus) && d.ProductionName.Contains(keyWord)).ToList();
                    TotalRecords = tempList.Count;
                    TotalPage = 0;
                    List<FinancingRequirements> flist = tempList.Skip(pageSize * pageIndex).Take(pageSize).ToList();
                    Utility.CopyList<Entities.FinancingRequirements, FinancingRequirementsDTO>(flist, list);
                }
                else
                {
                    #region 关联用户查询
                    User user = UserHelper.CurrentUserData;
                    string sql =
                        "select a.[FRID],a.Created,a.[ProductionName],a.[ProjectLogo],a.Industry,a.[FinancingAmount],a.Status,b.FollowID,b.CreatedBy,FollowCount=(select count(1) from [FinancingRequirementFollow] where frid=a.frid),c.UserName,c.UserID from [FinancingRequirements] a left join [FinancingRequirementFollow] b on a.frid=b.frid and b.CreatedBy=@CreatedBy left join [User] c on a.CreatedBy=c.UserID where 1=1";
                    List<SqlParameter> paralist = new List<SqlParameter>();
                    if (string.IsNullOrEmpty(conditions.IsAll))
                    {
                        sql += " and  a.Status=@Status";
                        paralist.Add(new SqlParameter("@Status",
                            SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString()));

                        if (user == null)
                        {
                            //未登陆
                            sql += " and a.PermissionControl=@permissionControl";
                            paralist.Add(new SqlParameter("@permissionControl", SISPIncubatorOnlineEnum.PermissionControl.Vistor.GetHashCode().ToString()));
                        }
                        else
                        {
                            //是否投资人
                            string investorStatus=SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();

                            var investor = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(i => i.UserID == user.UserID
                                && i.Status == investorStatus);

                            if (investor == null)
                            {
                                sql += " and (a.PermissionControl=@permissionControl or a.PermissionControl=@permissioncontrollogin) ";
                                paralist.Add(new SqlParameter("@permissionControl", SISPIncubatorOnlineEnum.PermissionControl.Vistor.GetHashCode().ToString()));
                                paralist.Add(new SqlParameter("@permissioncontrollogin", SISPIncubatorOnlineEnum.PermissionControl.Login.GetHashCode().ToString()));
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(conditions.IsAll) && conditions.IsAll == "my")
                    {
                        if (user == null)
                        {
                            throw new UnauthorizedException("用户登录状态已过期！请您重新登录！");
                        }
                        sql += " and  a.createdby=@createuser";
                        paralist.Add(new SqlParameter("@createuser", user.UserID));
                    }
                    if (!string.IsNullOrEmpty(conditions.Status))
                    {
                        sql += " and  a.Status=@Status";
                        paralist.Add(new SqlParameter("@Status",
                            conditions.Status));
                    }
                    if (!string.IsNullOrEmpty(conditions.KeyWord))
                    {
                        sql +=
                            " and a.[ProductionName] like @KeyWord";
                    }
                    sql += " order by a.Created desc";
                    if (user == null)
                    {
                        paralist.Add(new SqlParameter("@CreatedBy", DBNull.Value));
                    }
                    else
                    {
                        paralist.Add(new SqlParameter("@CreatedBy", user.UserID));
                    }
                    if (!string.IsNullOrEmpty(conditions.KeyWord))
                    {
                        paralist.Add(new SqlParameter("@KeyWord", "%" + conditions.KeyWord + "%"));
                    }
                    TotalRecords = 0;
                    TotalPage = 0;
                    IEnumerable<FinancingRequirementsDTO> totalrows =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<FinancingRequirementsDTO>(sql,
                            paralist.ToArray()).ToList();
                    if (totalrows != null && totalrows.Count() > 0)
                    {
                        List<Dictionary> dlist = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(d => d.Key == "Industry").ToList();
                        TotalRecords = totalrows.Count();
                        TotalPage = (TotalRecords + pageSize - 1) / pageSize;
                        IEnumerable<FinancingRequirementsDTO> rows =
                            totalrows.Skip(pageSize * pageIndex).Take(pageSize).ToList();

                        var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                        foreach (FinancingRequirementsDTO financingRequirementsDto in rows)
                        {
                            string industry = string.Empty;
                            if (financingRequirementsDto.CreatedBy != null)
                            {
                                financingRequirementsDto.IsFollowed = true;
                            }
                            else
                            {
                                financingRequirementsDto.IsFollowed = false;
                            }
                            financingRequirementsDto.ProjectLogo = serviceUrl + financingRequirementsDto.ProjectLogo;
                            foreach (Dictionary dictionary in dlist)
                            {
                                if (financingRequirementsDto.Industry.Contains(dictionary.ID.ToString()))
                                {
                                    industry += dictionary.Value + ",";
                                }
                            }
                            financingRequirementsDto.IndustryName = industry.TrimEnd(',');
                            list.Add(financingRequirementsDto);
                        }
                    }
                    #endregion
                }
            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            return list;
        }

        /// <summary>
        /// 根据查询条件获取所有融资需求信息
        /// </summary>
        /// <returns></returns>
        public List<FinancingRequirementsDTO> GetAll_PC(FinancingRequirementsRequest conditions)
        {
            List<FinancingRequirementsDTO> list = new List<FinancingRequirementsDTO>();
            if (conditions != null)
            {
                User user = UserHelper.CurrentUserData;
                string sql =
                    "select a.[FRID],a.[ProductionName],a.[ProjectLogo],a.Industry,a.[FinancingAmount],b.FollowID,b.CreatedBy,FollowCount=(select count(1) from [FinancingRequirementFollow] where frid=a.frid),c.UserName,c.UserID,ApproveDate=(select max([Created]) from [ApproveRecord] where [ApproveRelateID]=a.frid) from [FinancingRequirements] a left join [FinancingRequirementFollow] b on a.frid=b.frid and b.CreatedBy=@CreatedBy left join [User] c on a.CreatedBy=c.UserID where a.Status=@Status and a.[IsShow]=1 ";

                List<SqlParameter> paralist = new List<SqlParameter>();

                if (user == null)
                {
                    //未登陆
                    sql += " and a.PermissionControl=@permissionControl";
                    paralist.Add(new SqlParameter("@permissionControl", SISPIncubatorOnlineEnum.PermissionControl.Vistor.GetHashCode().ToString()));
                }
                else
                {
                    //是否投资人
                    string investorStatus = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();

                    var investor = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(i => i.UserID == user.UserID
                        && i.Status == investorStatus);

                    if (investor == null)
                    {
                        sql += " and (a.PermissionControl=@permissionControl or a.PermissionControl=@permissioncontrollogin) ";
                        paralist.Add(new SqlParameter("@permissionControl", SISPIncubatorOnlineEnum.PermissionControl.Vistor.GetHashCode().ToString()));
                        paralist.Add(new SqlParameter("@permissioncontrollogin", SISPIncubatorOnlineEnum.PermissionControl.Login.GetHashCode().ToString()));
                    }
                }

                sql += " order by ApproveDate desc";
                
                if (user == null)
                {
                    paralist.Add(new SqlParameter("@CreatedBy", DBNull.Value));
                }
                else
                {
                    paralist.Add(new SqlParameter("@CreatedBy", user.UserID));
                }
                paralist.Add(new SqlParameter("@Status", SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString()));

                IEnumerable<FinancingRequirementsDTO> rows = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<FinancingRequirementsDTO>(sql, paralist.ToArray()).ToList();
                if (rows != null && rows.Count() > 0)
                {
                    List<Dictionary> dlist = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(d => d.Key == "Industry").ToList();
                    var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                    foreach (FinancingRequirementsDTO financingRequirementsDto in rows)
                    {
                        string industry = string.Empty;
                        if (financingRequirementsDto.CreatedBy != null)
                        {
                            financingRequirementsDto.IsFollowed = true;
                        }
                        else
                        {
                            financingRequirementsDto.IsFollowed = false;
                        }
                        financingRequirementsDto.ProjectLogo = serviceUrl + financingRequirementsDto.ProjectLogo;
                        foreach (Dictionary dictionary in dlist)
                        {
                            if (financingRequirementsDto.Industry.Contains(dictionary.ID.ToString()))
                            {
                                industry += dictionary.Value + ",";
                            }
                        }
                        financingRequirementsDto.IndustryName = industry.TrimEnd(',');
                        list.Add(financingRequirementsDto);
                    }
                }
            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            return list;
        }

        /// <summary>
        /// 根据主键获取融资需求信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<FinancingRequirementsDTO> GetFinancingRequirementByfrId(Guid id)
        {
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            List<FinancingRequirements> list = new List<FinancingRequirements>();
            FinancingRequirements financingRequirements =
                SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.FirstOrDefault(
                    record => record.FRID == id);
            financingRequirements.ProjectLogo = serviceUrl + financingRequirements.ProjectLogo;
            DictionaryManager dm = new DictionaryManager();
            List<Dictionary> dlist = dm.GetAllByIDS(financingRequirements.Industry);
            string industry = string.Empty;
            foreach (Dictionary dictionary in dlist)
            {
                industry += dictionary.Value + ",";
            }
            list.Add(financingRequirements);
            List<FinancingRequirementsDTO> dtoList = new List<FinancingRequirementsDTO>();
            Utility.CopyList<FinancingRequirements, FinancingRequirementsDTO>(list, dtoList);
            dtoList[0].IndustryName = industry.TrimEnd(',');
            return dtoList;
        }

        /// <summary>
        /// 根据主键获取融资需求信息与审批记录信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<FinancingRequirements> GetFinancingRequirementApproveListByfrId(Guid id)
        {
            List<FinancingRequirements> list = new List<FinancingRequirements>();
            var queryable =
              from record in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements
              where (record.FRID == id)
              select record;

            FinancingRequirements financingRequirements = queryable.FirstOrDefault();
            //TODO:关联已断,逻辑重写
            //if (financingRequirements.ApproveRecord.Count > 0)
            //{
            //    var approveRecords = from b in financingRequirements.ApproveRecord select b;
            //    financingRequirements.ApproveRecord = approveRecords.ToList();
            //}
            list.Add(financingRequirements);
            return list;
        }

        /// <summary>
        /// 新增数据
        /// </summary>
        /// <param name="financingRequirementsCreateRequest"></param>
        /// <returns></returns>
        public Guid CreateFinancingRequirements(FinancingRequirementsCreateRequest financingRequirementsCreateRequest)
        {
            FinancingRequirements financingRequirements = financingRequirementsCreateRequest.FinancingRequirements;
            WeiXinRequest weiXinRequest = financingRequirementsCreateRequest.WeiXinRequest;
            string fileUploadFolder = string.Empty;
            if (weiXinRequest != null)
            {
                WeiXinManager weiXinManager = new WeiXinManager();
                weiXinManager.GetMultimedia(weiXinRequest);
                fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                financingRequirements.ProjectLogo = fileUploadFolder + "\\" + weiXinRequest.FileName + ".jpg";
            }
            //else
            //{
            //    //throw new BadRequestException("[FinancingRequirementsManager Method(CreateFinancingRequirements): WeiXinRequest is null]上传图片失败！");
            //}
            if (financingRequirements != null)
            {
                var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                User user = UserHelper.CurrentUser;
                Guid reGuid = Guid.NewGuid();
                financingRequirements.FRID = reGuid;
                financingRequirements.Created = DateTime.Now;
                financingRequirements.CreatedBy = user.UserID;
                financingRequirements.ProjectLogo = financingRequirements.ProjectLogo.Replace(serviceUrl, "");
                bool isadmin = false;
                string addtype = financingRequirementsCreateRequest.AddType;
                if (!string.IsNullOrEmpty(addtype) && addtype == "manager")
                {
                    isadmin = true;
                }
                if (isadmin)
                {
                    financingRequirements.Status =
                        Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
                }
                else
                {
                    financingRequirements.Status =
                        Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Add(financingRequirements);
                //审批记录
                ApproveRecord approveRecord = new ApproveRecord();
                approveRecord.ApproveRelateID = reGuid;
                approveRecord.RecordID = Guid.NewGuid();
                approveRecord.Created = DateTime.Now;
                approveRecord.ApplyType =
                    SISPIncubatorOnlineEnum.ApplyType.FinancingApply.GetHashCode().ToString();
                if (isadmin)
                {
                    approveRecord.ApproveNode =
                        SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                    approveRecord.ApproveResult =
                        SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                }
                else
                {
                    approveRecord.ApproveNode =
                        SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                    approveRecord.ApproveResult =
                        SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                }
                approveRecord.Applicant = user.UserID;
                approveRecord.Approver = user.UserID;
                SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[FinancingRequirementsManager Method(CreateFinancingRequirements): FinancingRequirementsCreateRequest is null]未获取到新增的数据！");
            }
            return financingRequirements.FRID;
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void DeleteFinancingRequirement(Guid id)
        {
            FinancingRequirements model = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.FirstOrDefault(m => m.FRID == id);
            if (model != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Remove(model);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();

            }
            else
            {
                throw new BadRequestException("[FinancingRequirementsManager Method(DeleteFinancingRequirement): FinancingRequirements is null,id=" + id + "]未获取到要删除的数据！");
            }
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="financingRequirementsCreateRequest"></param>
        /// <returns></returns>
        public void UpdateFinancingRequirement(FinancingRequirementsCreateRequest financingRequirementsCreateRequest)
        {
            FinancingRequirements updatemodel = financingRequirementsCreateRequest.FinancingRequirements;
            if (updatemodel == null)
            {
                throw new BadRequestException("[FinancingRequirementsManager Method(UpdateFinancingRequirement): FinancingRequirements is null]未获取到要更新的信息！");
            }
            WeiXinRequest weiXinRequest = financingRequirementsCreateRequest.WeiXinRequest;
            if (weiXinRequest != null)
            {
                WeiXinManager weiXinManager = new WeiXinManager();
                weiXinManager.GetMultimedia(weiXinRequest);
            }
            FinancingRequirements model = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.FirstOrDefault(m => m.FRID == updatemodel.FRID);
            if (model != null)
            {
                GetModel(updatemodel, model, financingRequirementsCreateRequest.WeiXinRequest);
                //bool isadmin = false;
                //string addtype = financingRequirementsCreateRequest.AddType;
                //if (!string.IsNullOrEmpty(addtype) && addtype == "manager")
                //{
                //    isadmin = true;
                //}
                //if (isadmin)
                //{
                //    model.Status = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                //}
                //User user = UserHelper.CurrentUser;
                ////审批记录
                //ApproveRecord approveRecord = new ApproveRecord();
                //approveRecord.ApproveRelateID = model.FRID;
                //approveRecord.RecordID = Guid.NewGuid();
                //approveRecord.Created = DateTime.Now;
                //approveRecord.ApplyType =
                //    SISPIncubatorOnlineEnum.ApplyType.FinancingApply.GetHashCode().ToString();
                //approveRecord.ApproveNode =
                //        SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                //approveRecord.ApproveResult =
                //    SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                //approveRecord.Applicant = user.UserID;
                //approveRecord.Approver = user.UserID;
                //SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[FinancingRequirementsManager Method(UpdateFinancingRequirement): FinancingRequirements is null,id=" + updatemodel.FRID + "]未获取到要更新的数据！");
            }
        }

        /// <summary>
        /// 执行撤销操作
        /// </summary>
        /// <param name="financingRequirementsCreateRequest"></param>
        public void RevokeFinancingRequirements(FinancingRequirementsCreateRequest financingRequirementsCreateRequest)
        {
            if (financingRequirementsCreateRequest != null)
            {
                if (financingRequirementsCreateRequest.FinancingRequirements != null)
                {
                    Guid guid = financingRequirementsCreateRequest.FinancingRequirements.FRID;
                    FinancingRequirements financingRequirements = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.FirstOrDefault(p => p.FRID == guid);
                    if (financingRequirements != null)
                    {
                        financingRequirements.Status = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                    }
                    User user = UserHelper.CurrentUser;
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord();
                    approveRecord.ApproveRelateID = guid;
                    approveRecord.RecordID = Guid.NewGuid();
                    approveRecord.Created = DateTime.Now;
                    approveRecord.ApplyType =
                        SISPIncubatorOnlineEnum.ApplyType.FinancingApply.GetHashCode().ToString();
                    approveRecord.ApproveNode =
                        SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                    approveRecord.ApproveResult =
                        SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                    approveRecord.Applicant = user.UserID;
                    approveRecord.Approver = user.UserID;
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    throw new BadRequestException("[FinancingRequirementsManager Method(RevokeFinancingRequirements): financingRequirementsCreateRequest is null]Api参数错误！");
                }
            }
            else
            {
                throw new BadRequestException("[FinancingRequirementsManager Method(RevokeFinancingRequirements): financingRequirementsCreateRequest is null]Api参数错误！");
            }
        }

        private void GetModel(FinancingRequirements financingRequirements, FinancingRequirements model, WeiXinRequest weiXinRequest)
        {
            if (financingRequirements != null)
            {
                var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                model.FRID = financingRequirements.FRID;
                if (weiXinRequest != null && !string.IsNullOrEmpty(weiXinRequest.MediaID) &&
                    !string.IsNullOrEmpty(weiXinRequest.SavePath) && !string.IsNullOrEmpty(weiXinRequest.FileName))
                {
                    string fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                    model.ProjectLogo = fileUploadFolder + "\\" + weiXinRequest.FileName + ".jpg";
                }
                else
                {
                    model.ProjectLogo = financingRequirements.ProjectLogo.Replace(serviceUrl, "");
                }
                model.ProductionName = financingRequirements.ProductionName;
                model.CompanyDescription = financingRequirements.CompanyDescription;
                model.CoreTeam = financingRequirements.CoreTeam;
                model.DevelopmentalStage = financingRequirements.DevelopmentalStage;
                model.FinancingAmount = financingRequirements.FinancingAmount;
                model.Industry = financingRequirements.Industry;
                model.MarketAnalysis = financingRequirements.MarketAnalysis;
                model.OtherInfo = financingRequirements.OtherInfo;
                model.ProductionDescription = financingRequirements.ProductionDescription;
                model.IsShow = financingRequirements.IsShow;
                model.PermissionControl = financingRequirements.PermissionControl;
            }
        }

    }
}