using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class GlobalSearchManager : BaseManager
    {
        private string serviceUrl = ConfigurationManager.AppSettings["ServiceImgUrl"];
        /// <summary>
        /// 获取查询投资机构数据
        /// </summary>
        /// <param name="globalSearchRequest"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        public List<InvestorInformationDTO> GetInvestors(GlobalSearchRequest globalSearchRequest, out int totalCount)
        {
            int total = 0;
            List<InvestorInformation> list = new List<InvestorInformation>();
            List<InvestorInformationDTO> listDto = new List<InvestorInformationDTO>();
            //User user = UserHelper.CurrentUser;
            if (globalSearchRequest != null)
            {
                string keyWords = globalSearchRequest.KeyWord;
                int pageSize = Convert.ToInt32(globalSearchRequest.PageSize);
                int pageIndex = Convert.ToInt32(globalSearchRequest.PageNumber - 1);

                List<InvestorInformation> listTmp =
                    SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.Where(
                        p =>
                            (p.Address.Contains(keyWords) || p.CompanyName.Contains(keyWords) ||
                            p.InvestorName.Contains(keyWords) || p.Email.Contains(keyWords) || p.InvestmentCase.Contains(keyWords) || p.InvestmentField.Contains(keyWords)) && p.Status == "2").ToList();
                total = listTmp.Count;
                list = listTmp.OrderBy(p => p.Created).Skip(pageSize * pageIndex).Take(pageSize).ToList<InvestorInformation>();
                foreach (InvestorInformation investorInformation in list)
                {
                    InvestorInformationDTO investorInformationDto = new InvestorInformationDTO();
                    investorInformationDto.Address = investorInformation.Address;
                    investorInformationDto.CompanyLogo = serviceUrl + investorInformation.CompanyLogo;
                    investorInformationDto.CompanyName = investorInformation.CompanyName;
                    investorInformationDto.Created = investorInformation.Created;
                    investorInformationDto.Email = investorInformation.Email;

                    investorInformationDto.FollowCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.Where(
                            p => p.FRID == investorInformation.UserID).ToList().Count;
                    FinancingRequirementFollow financingRequirementFollow = SISPIncubatorOnlinePlatformEntitiesInstance
                        .FinancingRequirementFollow.FirstOrDefault(
                            p => p.FRID == investorInformation.UserID);
                    if (financingRequirementFollow != null)
                    {
                        investorInformationDto.FollowID = financingRequirementFollow.FollowID;
                    }

                    investorInformationDto.FundScale = investorInformation.FundScale;
                    investorInformationDto.InvestmentCase = investorInformation.InvestmentCase;
                    investorInformationDto.InvestmentField = investorInformation.InvestmentField;
                    investorInformationDto.InvestmentStage = investorInformation.InvestmentStage;
                    investorInformationDto.InvestorName = investorInformation.InvestorName;
                    investorInformationDto.UserID = investorInformation.UserID;
                    User userInvest =
                        SISPIncubatorOnlinePlatformEntitiesInstance.User.FirstOrDefault(
                            p => p.UserID == investorInformation.UserID);
                    if (userInvest != null)
                    {
                        investorInformationDto.UserName = userInvest.UserName;

                    }
                    listDto.Add(investorInformationDto);
                }
            }
            else
            {
                LoggerHelper.Error("[GlobalSearchManager Method(GetInvestors): globalSearchRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetInvestors): globalSearchRequest is null]未能正确获取查询条件！");
            }
            totalCount = total;
            return listDto;
        }

        /// <summary>
        /// 获取查询融资项目数据
        /// </summary>
        /// <param name="globalSearchRequest"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        public List<FinancingRequirementsDTO> GetFinancingRequirements(GlobalSearchRequest globalSearchRequest, out int totalCount)
        {
            int total = 0;
            List<FinancingRequirements> list = new List<FinancingRequirements>();
            List<FinancingRequirementsDTO> listDTO = new List<FinancingRequirementsDTO>();
            List<FinancingRequirements> listTmp = new List<FinancingRequirements>();
            //User user = UserHelper.CurrentUser;
            if (globalSearchRequest != null)
            {
                string keyWords = globalSearchRequest.KeyWord;
                int pageSize = Convert.ToInt32(globalSearchRequest.PageSize);
                int pageIndex = Convert.ToInt32(globalSearchRequest.PageNumber - 1);

                //permission control
                User user = UserHelper.CurrentUserData;
                string visitorPermission = string.Empty;
                string loginPermission = string.Empty;

                if (user == null)
                {
                    //未登陆
                    visitorPermission = SISPIncubatorOnlineEnum.PermissionControl.Vistor.GetHashCode().ToString();

                    listTmp =
                   SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Where(
                       p =>
                          (p.CompanyDescription.Contains(keyWords) || p.ProductionDescription.Contains(keyWords) || p.DevelopmentalStage.Contains(keyWords) ||
                           p.ProductionName.Contains(keyWords) || p.MarketAnalysis.Contains(keyWords) || p.OtherInfo.Contains(keyWords) || p.CoreTeam.Contains(keyWords))
                           && p.PermissionControl == visitorPermission).ToList();
                }
                else
                {
                    //是否投资人
                    string investorStatus = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();

                    var investor = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.FirstOrDefault(i => i.UserID == user.UserID
                        && i.Status == investorStatus);

                    if (investor == null)
                    {
                        visitorPermission = SISPIncubatorOnlineEnum.PermissionControl.Vistor.GetHashCode().ToString();
                        loginPermission = SISPIncubatorOnlineEnum.PermissionControl.Login.GetHashCode().ToString();

                        listTmp =
                   SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Where(
                       p =>
                          (p.CompanyDescription.Contains(keyWords) || p.ProductionDescription.Contains(keyWords) || p.DevelopmentalStage.Contains(keyWords) ||
                           p.ProductionName.Contains(keyWords) || p.MarketAnalysis.Contains(keyWords) || p.OtherInfo.Contains(keyWords) || p.CoreTeam.Contains(keyWords))
                           && (p.PermissionControl == visitorPermission || p.PermissionControl == loginPermission)).ToList();
                    }
                }


                total = listTmp.Count;
                list = listTmp.OrderBy(p => p.Created).Skip(pageSize * pageIndex).Take(pageSize).ToList<FinancingRequirements>();

                List<Dictionary> dlist = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(d => d.Key == "Industry").ToList();

                foreach (FinancingRequirements financingRequirements in list)
                {
                    FinancingRequirementsDTO financingRequirementsDto = new FinancingRequirementsDTO();
                    financingRequirementsDto.CompanyDescription = financingRequirements.CompanyDescription;
                    financingRequirementsDto.CoreTeam = financingRequirements.CoreTeam;
                    financingRequirementsDto.Created = financingRequirements.Created;
                    financingRequirementsDto.CreatedBy = financingRequirements.CreatedBy;
                    financingRequirementsDto.FollowCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirementFollow.Where(
                            p => p.FRID == financingRequirements.FRID).ToList().Count;
                    financingRequirementsDto.DevelopmentalStage = financingRequirements.DevelopmentalStage;
                    financingRequirementsDto.FinancingAmount = financingRequirements.FinancingAmount;
                    financingRequirementsDto.Industry = financingRequirements.Industry;
                    financingRequirementsDto.OtherInfo = financingRequirements.OtherInfo;
                    financingRequirementsDto.ProjectLogo = serviceUrl + financingRequirements.ProjectLogo;
                    financingRequirementsDto.ProductionDescription = financingRequirements.ProductionDescription;
                    financingRequirementsDto.ProductionName = financingRequirements.ProductionName;
                    financingRequirementsDto.MarketAnalysis = financingRequirements.MarketAnalysis;
                    financingRequirementsDto.UserName = financingRequirements.User.UserName;
                    financingRequirementsDto.UserID = financingRequirements.User.UserID;
                    financingRequirementsDto.IsShow = financingRequirements.IsShow;
                    financingRequirementsDto.FRID = financingRequirements.FRID;
                    string industry = string.Empty;
                    foreach (Dictionary dictionary in dlist)
                    {
                        if (financingRequirementsDto.Industry.Contains(dictionary.ID.ToString()))
                        {
                            industry += dictionary.Value + ",";
                        }
                    }
                    financingRequirementsDto.IndustryName = industry.TrimEnd(',');


                    FinancingRequirementFollow financingRequirementFollow = SISPIncubatorOnlinePlatformEntitiesInstance
                        .FinancingRequirementFollow.FirstOrDefault(
                            p => p.FRID == financingRequirements.FRID);
                    if (financingRequirementFollow != null)
                    {
                        financingRequirementsDto.FollowID = financingRequirementFollow.FollowID;
                    }

                    listDTO.Add(financingRequirementsDto);
                }
            }
            else
            {
                LoggerHelper.Error("[GlobalSearchManager Method(GetFinancingRequirements): globalSearchRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetFinancingRequirements): globalSearchRequest is null]未能正确获取查询条件！");
            }
            totalCount = total;
            return listDTO;
        }

        /// <summary>
        /// 获取查询服务数据
        /// </summary>
        /// <param name="globalSearchRequest"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        public List<ServicePublishDTO> GetServicePublishs(GlobalSearchRequest globalSearchRequest, out int totalCount)
        {
            int total = 0;
            List<ServicePublish> list = new List<ServicePublish>();
            List<ServicePublishDTO> listDTO = new List<ServicePublishDTO>();
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            if (globalSearchRequest != null)
            {
                string keyWords = globalSearchRequest.KeyWord;
                int pageSize = Convert.ToInt32(globalSearchRequest.PageSize);
                int pageIndex = Convert.ToInt32(globalSearchRequest.PageNumber - 1);

                List<ServicePublish> listTmp =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ServicePublish.Where(
                        p =>
                            (p.Address.Contains(keyWords) || p.CompanyName.Contains(keyWords) ||
                            p.Description.Contains(keyWords) || p.PhoneNumber.Contains(keyWords) || p.Category.Contains(keyWords) || p.Email.Contains(keyWords)) && p.Status == approvedStatus).ToList();
                total = listTmp.Count;
                list = listTmp.OrderBy(p => p.Created).Skip(pageSize * pageIndex).Take(pageSize).ToList<ServicePublish>();
                foreach (ServicePublish servicePublish in list)
                {
                    ServicePublishDTO servicePublishDto = new ServicePublishDTO();
                    servicePublishDto.Address = servicePublish.Address;
                    servicePublishDto.Category = servicePublish.Category;
                    servicePublishDto.CompanyName = servicePublish.CompanyName;
                    servicePublishDto.Created = servicePublish.Created;
                    servicePublishDto.CreatedBy = servicePublish.CreatedBy;
                    servicePublishDto.ServiceID = servicePublish.ServiceID;
                    servicePublishDto.Description = servicePublish.Description;
                    servicePublishDto.Email = servicePublish.Email;

                    string img = SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Where(x => x.UserID == servicePublish.CreatedBy).Select(x => x.Headimgurl).FirstOrDefault();
                    if (img != null)
                    {
                        if (!img.Contains("http"))
                        {
                            servicePublishDto.ImgUrl = serviceUrl + img;
                        }
                        else
                        {
                            servicePublishDto.ImgUrl = img;
                        }
                    }
                    else
                    {
                        LoggerHelper.Error("[GlobalSearchManager Method(GetServicePublishs): img is null]img为null！");
                        //throw new BadRequestException("[IncubatorManager Method(GetServicePublishs): img is null]未能正确获取查询条件！");
                    }
                    DictionaryManager dm = new DictionaryManager();
                    List<Dictionary> dlist = dm.GetAllByIDS(servicePublish.Industry);
                    string industry = string.Empty;
                    foreach (Dictionary dictionary in dlist)
                    {
                        industry += dictionary.Value + ",";
                    }
                    servicePublishDto.IndustryName = industry;

                    servicePublishDto.Industry = servicePublish.Industry;
                    servicePublishDto.PhoneNumber = servicePublish.PhoneNumber;
                    servicePublishDto.Status = servicePublish.Status;
                    listDTO.Add(servicePublishDto);
                }
            }
            else
            {
                LoggerHelper.Error("[GlobalSearchManager Method(GetServicePublishs): globalSearchRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetServicePublishs): globalSearchRequest is null]未能正确获取查询条件！");
            }
            totalCount = total;
            return listDTO;
        }

        /// <summary>
        /// 获取查询需求数据
        /// </summary>
        /// <param name="globalSearchRequest"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        public List<DemandPublishDTO> GetDemandPublishs(GlobalSearchRequest globalSearchRequest, out int totalCount)
        {
            int total = 0;
            List<DemandPublish> list = new List<DemandPublish>();
            List<DemandPublishDTO> dtoList = new List<DemandPublishDTO>();
            string approvedStatus = Convert.ToString(SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode());
            if (globalSearchRequest != null)
            {
                string keyWords = globalSearchRequest.KeyWord;
                int pageSize = Convert.ToInt32(globalSearchRequest.PageSize);
                int pageIndex = Convert.ToInt32(globalSearchRequest.PageNumber - 1);

                List<DemandPublish> listTmp =
                    SISPIncubatorOnlinePlatformEntitiesInstance.DemandPublish.Where(
                        p =>
                            (p.CompanyName.Contains(keyWords) || p.Contacts.Contains(keyWords) ||
                            p.DemandDescription.Contains(keyWords) || p.Category.Contains(keyWords) || p.IntentionPartner.Contains(keyWords) || p.Email.Contains(keyWords)) && p.Status == approvedStatus).ToList();
                total = listTmp.Count;
                list = listTmp.OrderBy(p => p.Created).Skip(pageSize * pageIndex).Take(pageSize).ToList<DemandPublish>();
                foreach (DemandPublish demandPublish in list)
                {
                    DemandPublishDTO demandPublishDto = new DemandPublishDTO();

                    demandPublishDto.DemandID = demandPublish.DemandID;
                    demandPublishDto.CompanyName = demandPublish.CompanyName;
                    demandPublishDto.Contacts = demandPublish.Contacts;
                    demandPublishDto.Created = demandPublish.Created;
                    demandPublishDto.CreatedBy = demandPublish.CreatedBy;
                    demandPublishDto.Category = demandPublish.Category;
                    demandPublishDto.DemandDescription = demandPublish.DemandDescription;
                    demandPublishDto.Email = demandPublish.Email;
                    demandPublishDto.FoundedTime = demandPublish.FoundedTime;
                    string img = SISPIncubatorOnlinePlatformEntitiesInstance.WeChat.Where(x => x.UserID == demandPublish.CreatedBy).Select(x => x.Headimgurl).FirstOrDefault();
                    if (img != null)
                    {
                        if (!img.Contains("http"))
                        {
                            demandPublishDto.ImgUrl = serviceUrl + img;
                        }
                        else
                        {
                            demandPublishDto.ImgUrl = img;
                        }
                    }
                    else
                    {
                        LoggerHelper.Error("[GlobalSearchManager Method(GetDemandPublishs): img is null]未能正确获取查询条件！");
                    }

                    demandPublishDto.IntentionPartner = demandPublish.IntentionPartner;
                    demandPublishDto.Members = demandPublish.Members;
                    demandPublishDto.Mobile = demandPublish.Mobile;
                    demandPublishDto.ProjectDescription = demandPublish.ProjectDescription;
                    demandPublishDto.Status = demandPublish.Status;
                    dtoList.Add(demandPublishDto);

                }
            }
            else
            {
                LoggerHelper.Error("[GlobalSearchManager Method(GetDemandPublishs): globalSearchRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetDemandPublishs): globalSearchRequest is null]未能正确获取查询条件！");
            }
            totalCount = total;
            return dtoList;
        }
    }
}