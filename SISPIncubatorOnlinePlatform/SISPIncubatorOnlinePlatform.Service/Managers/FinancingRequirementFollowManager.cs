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
    public class FinancingRequirementFollowManager:BaseManager
    {

        /// <summary>
        /// 根据查询条件获取所有我的关注信息
        /// </summary>
        /// <returns></returns>
        public List<FinancingRequirementFollowDTO> GetAll(FinancingRequirementFollowRequest conditions)
        {
            List<FinancingRequirementFollowDTO> list = new List<FinancingRequirementFollowDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                User user = UserHelper.CurrentUser;
                string sql =
                    " select a.*,b.ProjectLogo,b.ProductionName,c.CompanyLogo,c.CompanyName from [FinancingRequirementFollow] a left join FinancingRequirements b on a.frid=b.frid left join InvestorInformation c on a.frid=c.userid where a.createdby=@CreatedBy order by a.created desc";
                
                List<SqlParameter> paralist = new List<SqlParameter>();
                paralist.Add(new SqlParameter("@CreatedBy", user.UserID));
                IEnumerable<FinancingRequirementFollowDTO> rows = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<FinancingRequirementFollowDTO>(sql, paralist.ToArray()).Skip(pageSize * pageIndex).Take(pageSize).ToList();
                if (rows != null && rows.Count() > 0)
                {
                    var serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
                    foreach (FinancingRequirementFollowDTO FinancingRequirementFollowDto in rows)
                    {
                        if (!string.IsNullOrEmpty(FinancingRequirementFollowDto.CompanyLogo))
                        {
                            FinancingRequirementFollowDto.CompanyLogo = serviceUrl + FinancingRequirementFollowDto.CompanyLogo;
                        }
                        if (!string.IsNullOrEmpty(FinancingRequirementFollowDto.ProjectLogo))
                        {
                            FinancingRequirementFollowDto.ProjectLogo = serviceUrl +
                                                                        FinancingRequirementFollowDto.ProjectLogo;
                        }
                        list.Add(FinancingRequirementFollowDto);
                    }
                }
            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            return list;
        }

        public MyFinancingRequirementFollowResponse GetMyFinancingRequirementAll(FinancingRequirementFollowRequest conditions)
        {
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            MyFinancingRequirementFollowResponse myFinancingRequirementFollowResponse = new MyFinancingRequirementFollowResponse();
            IQueryable<MyFinancingRequirementFollowDTO> financingRequirements;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                User user = UserHelper.CurrentUser;
                if (string.IsNullOrEmpty(conditions.SearchString))
                {
                    financingRequirements = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                 join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                                                 where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                 orderby b.Created
                                                 select new MyFinancingRequirementFollowDTO()
                                                 {
                                                     FollowID = a.FollowID,
                                                     FRID = a.FRID,
                                                     ProductionName = b.ProductionName,
                                                     Industry = b.Industry,
                                                     FinancingAmount = b.FinancingAmount,
                                                     UserID = c.UserID,
                                                     UserName = c.UserName
                                                 }).Skip(pageSize * pageIndex).Take(pageSize);

                    myFinancingRequirementFollowResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                                       join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                                                                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                                                                       where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                                       orderby b.Created
                                                                       select new MyFinancingRequirementFollowDTO()
                                                                       {
                                                                           FollowID = a.FollowID,
                                                                           FRID = a.FRID,
                                                                           ProductionName = b.ProductionName,
                                                                           Industry = b.Industry,
                                                                           FinancingAmount = b.FinancingAmount,
                                                                           UserID = c.UserID,
                                                                           UserName = c.UserName
                                                                       }).Count();
                }
                else
                {
                    financingRequirements = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                 join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                                                 where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                 orderby b.Created
                                                 select new MyFinancingRequirementFollowDTO()
                                                 {
                                                     FollowID = a.FollowID,
                                                     FRID = a.FRID,
                                                     ProductionName = b.ProductionName,
                                                     Industry = b.Industry,
                                                     FinancingAmount = b.FinancingAmount,
                                                     UserID = c.UserID,
                                                     UserName = c.UserName
                                                 }).Where(x=>x.ProductionName.Contains(conditions.SearchString)).Skip(pageSize * pageIndex).Take(pageSize);

                    myFinancingRequirementFollowResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                                       join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                                                                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                                                                       where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                                       orderby b.Created
                                                                       select new MyFinancingRequirementFollowDTO()
                                                                       {
                                                                           FollowID = a.FollowID,
                                                                           FRID = a.FRID,
                                                                           ProductionName = b.ProductionName,
                                                                           Industry = b.Industry,
                                                                           FinancingAmount = b.FinancingAmount,
                                                                           UserID = c.UserID,
                                                                           UserName = c.UserName
                                                                       }).Where(x => x.ProductionName.Contains(conditions.SearchString)).Count();
                }
                
            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            var list = financingRequirements.ToList<MyFinancingRequirementFollowDTO>();
            foreach (var myFollow in list)
            {
                DictionaryManager dm = new DictionaryManager();
                List<Dictionary> dlist = dm.GetAllByIDS(myFollow.Industry);
                string industry = string.Empty;
                foreach (Dictionary dictionary in dlist)
                {
                    industry += dictionary.Value + ",";
                }
                myFollow.IndustryName = industry.TrimEnd(',');
            }

            myFinancingRequirementFollowResponse.Results = list;
          
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                myFinancingRequirementFollowResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                myFinancingRequirementFollowResponse.TotalPage = (myFinancingRequirementFollowResponse.TotalCount + size - 1) / size;
            }
            return myFinancingRequirementFollowResponse;
        }

        public MyInvestorFollowResponse GetMyInvestorAll(FinancingRequirementFollowRequest conditions)
        {
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            MyInvestorFollowResponse myInvestorFollowResponse = new MyInvestorFollowResponse();
            IQueryable<MyInvestorFollowDTO> investors;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                User user = UserHelper.CurrentUser;
                if (string.IsNullOrEmpty(conditions.SearchString))
                {
                    investors = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                 join b in SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation on a.FRID equals b.UserID
                                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.UserID equals c.UserID
                                                 where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                 orderby b.Created
                                                 select new MyInvestorFollowDTO()
                                                 {
                                                     FollowID = a.FollowID,
                                                     FRID = a.FRID,
                                                     CompanyName=b.CompanyName,
                                                     InvestmentField=b.InvestmentField,
                                                     FundScale=b.FundScale,
                                                     UserID = c.UserID,
                                                     UserName=c.UserName
                                                 }).Skip(pageSize * pageIndex).Take(pageSize);
                    myInvestorFollowResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                           join b in SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation on a.FRID equals b.UserID
                                                           join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.UserID equals c.UserID
                                                           where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                           orderby b.Created
                                                           select new MyInvestorFollowDTO()
                                                           {
                                                               FollowID = a.FollowID,
                                                               FRID = a.FRID,
                                                               CompanyName = b.CompanyName,
                                                               InvestmentField = b.InvestmentField,
                                                               FundScale = b.FundScale,
                                                               UserID = c.UserID,
                                                               UserName = c.UserName
                                                           }).Count();
                }
                else
                {
                    investors = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                join b in SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation on a.FRID equals b.UserID
                                                  where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                 orderby b.Created
                                                 select new MyInvestorFollowDTO()
                                                 {
                                                     FollowID = a.FollowID,
                                                     FRID = a.FRID,
                                                     CompanyName = b.CompanyName,
                                                     InvestmentField = b.InvestmentField,
                                                     FundScale = b.FundScale
                                                 }).Where(x=>x.CompanyName.Contains(conditions.SearchString) ||x.InvestmentField.Contains(conditions.SearchString)).Skip(pageSize * pageIndex).Take(pageSize);
                    myInvestorFollowResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                           join b in SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation on a.FRID equals b.UserID
                                                           where b.Status == approvedStatus && a.CreatedBy == user.UserID
                                                           orderby b.Created
                                                           select new MyInvestorFollowDTO()
                                                           {
                                                               FollowID = a.FollowID,
                                                               FRID = a.FRID,
                                                               CompanyName = b.CompanyName,
                                                               InvestmentField = b.InvestmentField,
                                                               FundScale = b.FundScale
                                                           }).Where(x=>x.CompanyName.Contains(conditions.SearchString) ||x.InvestmentField.Contains(conditions.SearchString)).Count();
                }
                
            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            var list = investors.ToList<MyInvestorFollowDTO>();
            myInvestorFollowResponse.Results = list;
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                myInvestorFollowResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                myInvestorFollowResponse.TotalPage = (myInvestorFollowResponse.TotalCount + size - 1) / size;
            }
            return myInvestorFollowResponse;
        }

        public MyFansResponse GetMyFans(FinancingRequirementFollowRequest conditions)
        {
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            string financingType = Convert.ToString(SISPIncubatorOnlineEnum.FollowType.Financing.GetHashCode());
            string investorType = Convert.ToString(SISPIncubatorOnlineEnum.FollowType.Investor.GetHashCode());
            MyFansResponse myFansResponse = new MyFansResponse();
            IQueryable<MyFansDTO> fans;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                User user = UserHelper.CurrentUser;
                if (string.IsNullOrEmpty(conditions.SearchString))
                {
                    fans = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                            join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                            join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                            where b.Status == approvedStatus && a.FollowType == financingType && b.CreatedBy == user.UserID
                            select new MyFansDTO()
                            {
                                UserID = c.UserID,
                                UserName = c.UserName,
                                UserType = c.UserType,
                                Email = c.Email,
                                Created = a.Created
                            }).Union(
                                 from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on a.FRID equals c.UserID
                                 where a.FollowType == investorType && a.FRID == c.UserID
                                 select new MyFansDTO()
                                 {
                                     UserID = c.UserID,
                                     UserName = c.UserName,
                                     UserType = c.UserType,
                                     Email = c.Email,
                                     Created = a.Created
                                 }).Distinct().OrderBy(x => x.Created).Skip(pageSize * pageIndex).Take(pageSize);
                    myFansResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                 join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                                                 where b.Status == approvedStatus && a.FollowType == financingType && b.CreatedBy == user.UserID
                                                 select new MyFansDTO()
                                                 {
                                                     UserID = c.UserID,
                                                     UserName = c.UserName,
                                                     UserType = c.UserType,
                                                     Email = c.Email,
                                                     Created = a.Created
                                                 }).Union(
                                 from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on a.FRID equals c.UserID
                                 where a.FollowType == investorType && a.FRID == c.UserID
                                 select new MyFansDTO()
                                 {
                                     UserID = c.UserID,
                                     UserName = c.UserName,
                                     UserType = c.UserType,
                                     Email = c.Email,
                                     Created = a.Created
                                 }).Distinct().Count();
                }
                else
                {
                    fans = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                            join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                            join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                            where b.Status == approvedStatus && a.FollowType == financingType && b.CreatedBy == user.UserID
                            select new MyFansDTO()
                            {
                                UserID = c.UserID,
                                UserName = c.UserName,
                                UserType = c.UserType,
                                Email = c.Email,
                                Created = a.Created
                            }).Union(
                                 from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on a.FRID equals c.UserID
                                 where a.FollowType == investorType && a.FRID == c.UserID
                                 select new MyFansDTO()
                                 {
                                     UserID = c.UserID,
                                     UserName = c.UserName,
                                     UserType = c.UserType,
                                     Email = c.Email,
                                     Created = a.Created
                                 }).Where(x=>x.UserName.Contains(conditions.SearchString)).Distinct().OrderBy(x => x.Created).Skip(pageSize * pageIndex).Take(pageSize);
                    myFansResponse.TotalCount = (from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                                 join b in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements on a.FRID equals b.FRID
                                                 join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on b.CreatedBy equals c.UserID
                                                 where b.Status == approvedStatus && a.FollowType == financingType && b.CreatedBy == user.UserID
                                                 select new MyFansDTO()
                                                 {
                                                     UserID = c.UserID,
                                                     UserName = c.UserName,
                                                     UserType = c.UserType,
                                                     Email = c.Email,
                                                     Created = a.Created
                                                 }).Union(
                                from a in SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow
                                join c in SISPIncubatorOnlinePlatformEntitiesInstance.User on a.FRID equals c.UserID
                                where a.FollowType == investorType && a.FRID == c.UserID
                                select new MyFansDTO()
                                {
                                    UserID = c.UserID,
                                    UserName = c.UserName,
                                    UserType = c.UserType,
                                    Email = c.Email,
                                    Created = a.Created
                                }).Where(x=>x.UserName.Contains(conditions.SearchString)).Distinct().Count();
                }

            }
            else
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            var list = fans.ToList<MyFansDTO>();
            myFansResponse.Results = list;
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                myFansResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                myFansResponse.TotalPage = (myFansResponse.TotalCount + size - 1) / size;
            }
            return myFansResponse;
        }

        /// <summary>
        /// 新增数据
        /// </summary>
        /// <param name="financingRequirementFollowCreateRequest"></param>
        /// <returns></returns>
        public Guid CreateFinancingRequirementFollow(FinancingRequirementFollowCreateRequest financingRequirementFollowCreateRequest)
        {
            FinancingRequirementFollow financingRequirementFollow = financingRequirementFollowCreateRequest.FinancingRequirementFollow;
            if (financingRequirementFollow != null)
            {
                User user = UserHelper.CurrentUser;
                FinancingRequirementFollow model = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.Where(d => d.FRID == financingRequirementFollow.FRID && d.CreatedBy == user.UserID).FirstOrDefault();
                if (model != null)
                {
                    throw new BadRequestException("[FinancingRequirementFollowManager Method(CreateFinancingRequirementFollow): FinancingRequirementFollowCreateRequest is null]不能重复关注！");
                }
                financingRequirementFollow.FollowID = Guid.NewGuid();
                financingRequirementFollow.Created = DateTime.Now;
                financingRequirementFollow.CreatedBy = user.UserID;
                if (financingRequirementFollow.FollowType == "0") //融资
                {
                    financingRequirementFollow.FollowType =
                        SISPIncubatorOnlineEnum.FollowType.Financing.GetHashCode().ToString();
                }
                else//投资人
                {
                    financingRequirementFollow.FollowType =
                        SISPIncubatorOnlineEnum.FollowType.Investor.GetHashCode().ToString();
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.Add(financingRequirementFollow);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[FinancingRequirementFollowManager Method(CreateFinancingRequirementFollow): FinancingRequirementFollowCreateRequest is null]未获取到要创建的对象！");
            }
            return financingRequirementFollow.FollowID;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="financingRequirementFollowCreateRequest"></param>
        /// <returns></returns>
        public void UpdateFinancingRequirementFollow(FinancingRequirementFollowCreateRequest financingRequirementFollowCreateRequest)
        {
            FinancingRequirementFollow updatemodel = financingRequirementFollowCreateRequest.FinancingRequirementFollow;
            if (updatemodel == null)
            {
                throw new BadRequestException("[FinancingRequirementFollowManager Method(UpdateFinancingRequirementFollow): FinancingRequirementFollow is null]未获取到要更新的数据！");
            }
            FinancingRequirementFollow financingRequirementFollow = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.FirstOrDefault(m => m.FollowID == updatemodel.FollowID);
            if (financingRequirementFollow != null)
            {
                GetModel(updatemodel, financingRequirementFollow);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges()<= 0)
                {
                    throw new BadRequestException("[FinancingRequirementFollowManager Method(UpdateFinancingRequirementFollow): 更新提交出错id=" + updatemodel.FollowID + "]更新提交出错！");
                }
            }
            else
            {
                throw new BadRequestException("[FinancingRequirementFollowManager Method(UpdateFinancingRequirementFollow): FinancingRequirementFollowCreateRequest is null]未获取到要更新的信息！");
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="followId"></param>
        /// <returns></returns>
        public void DeleteFinancingRequirementFollow(Guid followId)
        {
            FinancingRequirementFollow model = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.FirstOrDefault(m => m.FollowID == followId);
            if (model != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.Remove(model);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <=0)
                {
                    throw new BadRequestException("[FinancingRequirementFollowManager Method(DeleteFinancingRequirementFollow): 删除提交出错id=" + followId + "]删除提交出错！");
                }
            }
            else
            {
                throw new BadRequestException("[FinancingRequirementFollowManager Method(DeleteFinancingRequirementFollow):未获取到FinancingRequirementFollow，id=" + followId + "]未获取到要删除的对象！");
            }
        }

        /// <summary>
        /// GetModel
        /// </summary>
        /// <param name="financingRequirementDto"></param>
        /// <param name="model"></param>
        private void GetModel(FinancingRequirementFollow financingRequirementDto, FinancingRequirementFollow model)
        {
            if (financingRequirementDto != null)
            {
                model.FRID = financingRequirementDto.FRID;
                model.CreatedBy = financingRequirementDto.CreatedBy;                
            }
        }
    }
}