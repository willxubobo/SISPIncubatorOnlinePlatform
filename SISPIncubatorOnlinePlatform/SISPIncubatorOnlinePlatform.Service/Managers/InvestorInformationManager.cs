using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class InvestorInformationManager : BaseManager
    {
        /// <summary>
        /// 创建投资人信息
        /// </summary>
        /// <param name="investorInformationCreateRequest"></param>
        /// <returns></returns>
        public Guid CreateInvestorInformation(InvestorInformationCreateRequest investorInformationCreateRequest)
        {
            InvestorInformation model = investorInformationCreateRequest.InvestorInformation;

            if (model != null)
            {
                string status = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                User user = UserHelper.CurrentUser;
                Guid sUserID = user.UserID;
                if (!string.IsNullOrEmpty(investorInformationCreateRequest.AddType) &&
                    investorInformationCreateRequest.AddType == "admin")
                {
                    sUserID = model.UserID;
                }
                InvestorInformation investorInformation = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(m => m.UserID == sUserID);
                if (investorInformation != null)
                {
                    if (investorInformation.Status != status)
                    {
                        throw new BadRequestException("[InvestorInformationManager Method(CreateInvestorInformation): ]您已申请过为投资人，不能重复申请！");
                    }
                }
                string fileUploadFolder = string.Empty;
                WeiXinRequest weiXinRequest = investorInformationCreateRequest.WeiXinRequest;
                if (weiXinRequest != null)
                {
                    WeiXinManager weiXinManager = new WeiXinManager();
                    weiXinManager.GetMultimedia(weiXinRequest);
                    fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                    model.CompanyLogo = fileUploadFolder + "\\" + weiXinRequest.FileName + ".jpg";
                }
                //else//pc添加
                //{
                //    //throw new BadRequestException("[InvestorInformationManager Method(CreateInvestorInformation): WeiXinRequest is null]上传图片失败！");

                //}
                if (!string.IsNullOrEmpty(investorInformationCreateRequest.AddType) &&
                    investorInformationCreateRequest.AddType == "admin")
                {
                    model.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
                }
                else
                {
                    model.UserID = user.UserID;
                    model.Status = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode());
                }
                model.Created = DateTime.Now;
                
                SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.Add(model);
                //审批记录
                ApproveRecord approveRecord = new ApproveRecord();
                approveRecord.ApproveRelateID = sUserID;
                approveRecord.RecordID = Guid.NewGuid();
                approveRecord.Created = DateTime.Now;
                approveRecord.ApplyType =
                    SISPIncubatorOnlineEnum.ApplyType.InvestorApply.GetHashCode().ToString();
                if (!string.IsNullOrEmpty(investorInformationCreateRequest.AddType) &&
                    investorInformationCreateRequest.AddType == "admin")
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
                throw new BadRequestException("[InvestorInformationManager Method(CreateInvestorInformation): InvestorInformationCreateRequest is null]未获取到要创建的数据！");
            }
            return model.UserID;
        }

        /// <summary>
        /// 根据主键获取投资人信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<InvestorInformationDTO> GetInvestorInformationById(Guid id)
        {
            User user = UserHelper.CurrentUserData;
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            List<InvestorInformation> list = new List<InvestorInformation>();
            InvestorInformation investorInformation =
                SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(d => d.UserID == id);
            if (investorInformation != null)
            {
                investorInformation.CompanyLogo = serviceUrl + investorInformation.CompanyLogo;
                list.Add(investorInformation);
                List<InvestorInformationDTO> dtoList = new List<InvestorInformationDTO>();
                Utility.CopyList<InvestorInformation, InvestorInformationDTO>(list, dtoList);
                Guid istage = Guid.Parse(investorInformation.InvestmentStage);
                Dictionary dictionary =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.FirstOrDefault(d => d.ID == istage);
                dtoList[0].InvestmentStageName = dictionary.Value;
                if (user == null)//未登录时不显示邮箱
                {
                    dtoList[0].Email = "nodata";
                }
                return dtoList;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 根据主键获取投资人信息与审批信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<InvestorInformationDTO> GetInvestorInformationAndApproveById(Guid id)
        {
            var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
            List<InvestorInformation> list = new List<InvestorInformation>();
            var queryable =
              from record in SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation
              where (record.UserID == id)
              select record;

            InvestorInformation investorInformation = queryable.FirstOrDefault();
            //TODO:关联已断,逻辑重写
            //if (investorInformation.ApproveRecord.Count > 0)
            //{
            //    var approveRecords = from b in investorInformation.ApproveRecord select b;
            //    investorInformation.ApproveRecord = approveRecords.ToList();
            //}
            investorInformation.CompanyLogo = serviceUrl + investorInformation.CompanyLogo;
            list.Add(investorInformation);
            List<InvestorInformationDTO> dtoList = new List<InvestorInformationDTO>();
            Utility.CopyList<InvestorInformation, InvestorInformationDTO>(list, dtoList);
            return dtoList;
        }

        /// <summary>
        /// 根据查询条件获取投资人信息wechat
        /// </summary>
        /// <returns></returns>
        public List<InvestorInformationDTO> GetAll(InvestorInformationRequest conditions, out int TotalRecords, out int TotalPage)
        {
            List<InvestorInformationDTO> list = new List<InvestorInformationDTO>();
            if (conditions != null)
            {
                List<SqlParameter> paralist = new List<SqlParameter>();
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                if (!string.IsNullOrEmpty(conditions.ApproveList) && conditions.ApproveList == "true")
                {
                    string keyWord = conditions.KeyWord;
                    string approvestatus = conditions.Status;
                    List<InvestorInformation> tempList =
                        SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.Where(
                            d =>
                                d.Status.Contains(approvestatus) &&
                                (d.CompanyName.Contains(keyWord) || d.Address.Contains(keyWord) ||
                                 d.InvestorName.Contains(keyWord))).ToList();
                    TotalRecords = tempList.Count;
                    TotalPage = 0;
                    List<InvestorInformation> flist = tempList.Skip(pageSize * pageIndex).Take(pageSize).ToList();
                    Utility.CopyList<Entities.InvestorInformation, InvestorInformationDTO>(flist, list);
                    List<Dictionary> dlist = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(d => d.Key == "InvestmentStage").ToList();
                    foreach (InvestorInformationDTO fInformationDto in list)
                    {
                        Guid isstage = Guid.Parse(fInformationDto.InvestmentStage);
                        fInformationDto.InvestmentStageName = dlist.FirstOrDefault(d => d.ID == isstage).Value;
                    }
                }
                else
                {
                    #region 关联用户查询

                    User user = UserHelper.CurrentUserData;
                    string sql =
                        "select a.[UserID],a.[CompanyName],a.[CompanyLogo],a.InvestmentField,a.InvestmentStage,a.[InvestorName],a.Status,b.FollowID,b.CreatedBy,FollowCount=(select count(1) from [FinancingRequirementFollow] where frid=a.[UserID]),c.[UserName] from [InvestorInformation] a left join [FinancingRequirementFollow] b on a.[UserID]=b.frid and b.CreatedBy=@CreatedBy left join [User] c on a.UserID=c.UserID where 1=1";
                    if (string.IsNullOrEmpty(conditions.IsAll))
                    {
                        sql += " and  a.Status=@Status";
                        paralist.Add(new SqlParameter("@Status",
                            SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString()));
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
                            " and (a.[CompanyName] like @KeyWord or a.InvestmentField like @KeyWord or a.InvestorName like @KeyWord or a.Address like @KeyWord)";
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
                    IEnumerable<InvestorInformationDTO> totalrows =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<InvestorInformationDTO>(sql,
                            paralist.ToArray()).ToList();
                    if (totalrows != null && totalrows.Count() > 0)
                    {
                        TotalRecords = totalrows.Count();
                        TotalPage = (TotalRecords + pageSize - 1)/pageSize;
                        IEnumerable<InvestorInformationDTO> rows =
                            totalrows.Skip(pageSize*pageIndex).Take(pageSize).ToList();
                        List<Dictionary> dlist = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(d => d.Key == "InvestmentStage").ToList();
                        var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                        foreach (InvestorInformationDTO investorInformationDTO in rows)
                        {
                            if (investorInformationDTO.CreatedBy != null)
                            {
                                investorInformationDTO.IsFollowed = true;
                            }
                            else
                            {
                                investorInformationDTO.IsFollowed = false;
                            }
                            investorInformationDTO.CompanyLogo = serviceUrl + investorInformationDTO.CompanyLogo;
                            Guid isstage = Guid.Parse(investorInformationDTO.InvestmentStage);
                            investorInformationDTO.InvestmentStageName = dlist.FirstOrDefault(d => d.ID == isstage).Value;
                            list.Add(investorInformationDTO);
                        }
                    }

                    #endregion}
                }
            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            return list;
        }

        /// <summary>
        /// 根据查询条件获取所有投资人信息pc
        /// </summary>
        /// <returns></returns>
        public List<InvestorInformationDTO> GetAll_PC(InvestorInformationRequest conditions)
        {
            List<InvestorInformationDTO> list = new List<InvestorInformationDTO>();
            //if (conditions != null)
            //{
            User user = UserHelper.CurrentUserData;
            string sql =
                "select a.[UserID],a.[CompanyName],a.[CompanyLogo],a.InvestmentField,b.FollowID,b.CreatedBy,FollowCount=(select count(1) from [FinancingRequirementFollow] where frid=a.[UserID]),c.[UserName],ApproveDate=(select max([Created]) from [ApproveRecord] where [ApproveRelateID]=a.UserID) from [InvestorInformation] a left join [FinancingRequirementFollow] b on a.[UserID]=b.frid and b.CreatedBy=@CreatedBy left join [User] c on a.UserID=c.UserID where a.Status=@Status and a.[IsShow]=1";

            sql += " order by ApproveDate desc";//按照审批时间排序
            List<SqlParameter> paralist = new List<SqlParameter>();
            if (user == null)
            {
                paralist.Add(new SqlParameter("@CreatedBy", DBNull.Value));
            }
            else
            {
                paralist.Add(new SqlParameter("@CreatedBy", user.UserID));
            }
            paralist.Add(new SqlParameter("@Status", SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString()));

            IEnumerable<InvestorInformationDTO> rows = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<InvestorInformationDTO>(sql, paralist.ToArray()).ToList();
            if (rows != null && rows.Count() > 0)
            {
                var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                foreach (InvestorInformationDTO investorInformationDTO in rows)
                {
                    if (investorInformationDTO.CreatedBy != null)
                    {
                        investorInformationDTO.IsFollowed = true;
                    }
                    else
                    {
                        investorInformationDTO.IsFollowed = false;
                    }
                    investorInformationDTO.CompanyLogo = serviceUrl + investorInformationDTO.CompanyLogo;
                    list.Add(investorInformationDTO);
                }
            }
            //}
            //else
            //{
            //    throw new BadRequestException("未获取到查询条件！");
            //}
            return list;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="investorInformationCreateRequest"></param>
        /// <returns></returns>
        public void UpdateInvestorInformation(InvestorInformationCreateRequest investorInformationCreateRequest)
        {
            if (investorInformationCreateRequest.InvestorInformation == null)
            {
                throw new BadRequestException("[InvestorInformationManager Method(UpdateInvestorInformation): InvestorInformation is null]未获取到要更新的数据！");
            }
            WeiXinRequest weiXinRequest = investorInformationCreateRequest.WeiXinRequest;
            if (weiXinRequest != null)
            {
                WeiXinManager weiXinManager = new WeiXinManager();
                weiXinManager.GetMultimedia(weiXinRequest);
            }
            InvestorInformation updatemodel = investorInformationCreateRequest.InvestorInformation;
            InvestorInformation investorInformation = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(m => m.UserID == updatemodel.UserID);
            if (investorInformation != null)
            {
                investorInformation = GetModel(investorInformation, updatemodel, investorInformationCreateRequest.WeiXinRequest);
                //if (!string.IsNullOrEmpty(investorInformationCreateRequest.AddType) &&
                //    investorInformationCreateRequest.AddType == "admin")
                //{
                //    investorInformation.Status = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                //}
                //User user = UserHelper.CurrentUser;
                ////审批记录
                //ApproveRecord approveRecord = new ApproveRecord();
                //approveRecord.ApproveRelateID = investorInformation.UserID;
                //approveRecord.RecordID = Guid.NewGuid();
                //approveRecord.Created = DateTime.Now;
                //approveRecord.ApplyType =
                //    SISPIncubatorOnlineEnum.ApplyType.InvestorApply.GetHashCode().ToString();
                //approveRecord.ApproveNode =
                //    SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                //approveRecord.ApproveResult =
                //    SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                //approveRecord.Applicant = user.UserID;
                //approveRecord.Approver = user.UserID;
                //SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();

            }
            else
            {
                throw new BadRequestException("[InvestorInformationManager Method(UpdateInvestorInformation): InvestorInformationCreateRequest is null]未获取到要更新的数据！");
            }
        }

        /// <summary>
        /// 根据主键删除数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void DeleteInvestorInformation(Guid id)
        {
            InvestorInformation model = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(m => m.UserID == id);
            if (model != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.Remove(model);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();

            }
            else
            {
                throw new BadRequestException("[InvestorInformationManager Method(DeleteInvestorInformation): InvestorInformation is null,id=" + id + "]未获取到要删除的数据！");
            }
        }

        private InvestorInformation GetModel(InvestorInformation model, InvestorInformation investorInformation, WeiXinRequest weiXinRequest)
        {
            if (investorInformation != null)
            {
                var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                model.Address = investorInformation.Address;
                if (weiXinRequest != null && !string.IsNullOrEmpty(weiXinRequest.MediaID) &&
                    !string.IsNullOrEmpty(weiXinRequest.SavePath) && !string.IsNullOrEmpty(weiXinRequest.FileName))
                {
                    string fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                    model.CompanyLogo = fileUploadFolder + "\\" + weiXinRequest.FileName + ".jpg";
                }
                else
                {
                    model.CompanyLogo = investorInformation.CompanyLogo.Replace(serviceUrl,"");
                }
                model.CompanyName = investorInformation.CompanyName;
                //model.Created = investorInformation.Created;
                model.Email = investorInformation.Email;
                model.FundScale = investorInformation.FundScale;
                model.InvestmentCase = investorInformation.InvestmentCase;
                model.InvestmentField = investorInformation.InvestmentField;
                model.InvestmentStage = investorInformation.InvestmentStage;
                model.InvestorName = investorInformation.InvestorName;
                model.IsShow = investorInformation.IsShow;
                //model.Status = investorInformation.Status;
                return model;
            }
            else
            {
                return null;
            }
        }
    }
}