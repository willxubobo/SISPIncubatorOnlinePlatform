using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Configuration;
using System.Web;
using System.Web.UI.WebControls;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;


namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class IncubatorApplyManager : BaseManager
    {
        /// <summary>
        /// 获取所有孵化器申请列表数据
        /// </summary>
        /// <returns></returns>
        public List<IncubatorApplyDTO> GetAll(IncubatorApplyRequest conditions, out int totalCount)
        {
            List<IncubatorApply> list = new List<IncubatorApply>();
            List<IncubatorApplyDTO> listDTO = new List<IncubatorApplyDTO>();

            string status = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.Revoke.GetHashCode().ToString();

            string userType = "10";
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string roleName = conditions.IncubatorTypeRole;
                string keyWord = conditions.KeyWord;

                List<IncubatorApply> listTmp = new List<IncubatorApply>();
                if (!string.IsNullOrEmpty(roleName) && roleName == "incubatoradmin")
                {
                    User user = UserHelper.CurrentUser;
                    string status1 = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorApproved.GetHashCode().ToString();
                    string status2 = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.BrandIncubatorApproved.GetHashCode().ToString();
                    string statusWebAdmin = conditions.Status;
                    foreach (User_Roles userRoles in user.User_Roles)
                    {
                        List<IncubatorInformation> listIncubatorInformations =
                            userRoles.Roles.IncubatorInformation.ToList();
                        foreach (IncubatorInformation incubatorInformation in listIncubatorInformations)
                        {
                            Guid incubatorID = incubatorInformation.IncubatorID;
                            List<IncubatorApply> incubatorApplies;
                            if (!string.IsNullOrEmpty(statusWebAdmin))
                            {
                                incubatorApplies =
                                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                                        p =>
                                            p.IncubatorID == incubatorID &&
                                            (p.ApplyStatus == statusWebAdmin && (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                      p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) ||
                                      p.ProjectOwner.Contains(keyWord))))
                                        .OrderByDescending(p => p.Created)
                                        .ToList();
                                listTmp.AddRange(incubatorApplies);
                            }
                            else
                            {
                               incubatorApplies =
    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
        p => p.IncubatorID == incubatorID && (p.ApplyStatus == status1 || p.ApplyStatus == status2) && (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                      p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) ||
                                      p.ProjectOwner.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                                listTmp.AddRange(incubatorApplies);
                            }

                        }
                    }
                }//我申请的
                else if (roleName == "my")
                {
                    User user = UserHelper.CurrentUser;
                    listTmp =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                            p =>
                                p.CreatedBy == user.UserID && p.ApplyStatus != status &&
                                (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                 p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                 p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) || p.ProjectOwner.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                }//审核列表
                else if (roleName == "admin")
                {
                    User user = UserHelper.CurrentUser;
                    //string status1 = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.Pending.GetHashCode().ToString();
                    string status1 = conditions.Status;
                    string status2 = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorApproved.GetHashCode().ToString();
                    if (CheckIsAdminByDes(ConfigurationManager.AppSettings["SupperAdminName"], user))
                    {
                        listTmp =
                            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                                p => (p.ApplyStatus == status1) &&
                                     (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                      p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) ||
                                      p.ProjectOwner.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                        userType = "20";

                    }
                    else if (CheckIsAdminByDes(ConfigurationManager.AppSettings["CommonAdminName"], user))
                    {
                        listTmp =
                            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                                p => p.ApplyStatus == status1 &&
                                     (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                      p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) ||
                                      p.ProjectOwner.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                        userType = "30";
                    }
                    else
                    {
                        foreach (User_Roles userRoles in user.User_Roles)
                        {
                            List<IncubatorInformation> listIncubatorInformations =
                                userRoles.Roles.IncubatorInformation.ToList();
                            foreach (IncubatorInformation incubatorInformation in listIncubatorInformations)
                            {
                                Guid incubatorID = incubatorInformation.IncubatorID;
                                List<IncubatorApply> incubatorApplies =
                                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                                        p => p.IncubatorID == incubatorID ).OrderByDescending(p => p.Created).ToList();
                                listTmp.AddRange(incubatorApplies);
                            }
                        }
                        userType = "10";
                    }
                }//管理列表
                else if (roleName == "adminmanagment")
                {
                    string status1 = conditions.Status;
                    if (!string.IsNullOrEmpty(status1))
                    {
                        
                        listTmp =
                            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                                p => (p.ApplyStatus == status1) && (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                      p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) ||
                                      p.ProjectOwner.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                    }
                    else
                    {
                        listTmp =
                            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(
                                p => (p.CompanyName.Contains(keyWord) || p.CompanyTel.Contains(keyWord) ||
                                      p.ContactTel.Contains(keyWord) || p.Email.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord) || p.ProjectName.Contains(keyWord) ||
                                      p.ProjectOwner.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                    }

                }
                else
                {
                    listTmp = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.OrderByDescending(p => p.Created).ToList();
                }
                totalCount = listTmp.Count;

                list = listTmp.Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorApply>();

                foreach (IncubatorApply incubatorApply in list)
                {
                    IncubatorApplyDTO incubatorApplyDto = new IncubatorApplyDTO();
                    incubatorApplyDto.ApplyID = incubatorApply.ApplyID;
                    incubatorApplyDto.ApplyStatus = incubatorApply.ApplyStatus;
                    incubatorApplyDto.CompanyName = incubatorApply.CompanyName;
                    incubatorApplyDto.CompanyTel = incubatorApply.CompanyTel;
                    incubatorApplyDto.ContactTel = incubatorApply.ContactTel;
                    incubatorApplyDto.CoreStaffResume = incubatorApply.CoreStaffResume;
                    incubatorApplyDto.Email = incubatorApply.Email;
                    incubatorApplyDto.Created = incubatorApply.Created;
                    incubatorApplyDto.FinancingSituation = incubatorApply.FinancingSituation;
                    incubatorApplyDto.IncubatorID = incubatorApply.IncubatorID;
                    incubatorApplyDto.TeamMembers = incubatorApply.TeamMembers;
                    incubatorApplyDto.ProductDescription = incubatorApply.ProductDescription;
                    incubatorApplyDto.ProjectOwner = incubatorApply.ProjectOwner;
                    incubatorApplyDto.ProjectName = incubatorApply.ProjectName;
                    incubatorApplyDto.MarketRiskAnalysis = incubatorApply.MarketRiskAnalysis;
                    incubatorApplyDto.IsSign = incubatorApply.IsSign;
                    incubatorApplyDto.CreatedBy = incubatorApply.CreatedBy;
                    incubatorApplyDto.AppDate = incubatorApply.Created.ToString("yyyy-MM-dd");
                    incubatorApplyDto.AppUserName = incubatorApply.User.UserName;
                    incubatorApplyDto.ApplyStatusDes = GetIncubatorApplyStatus(incubatorApply.ApplyStatus);

                    AgreementTemplate agreementTemplate =
                    SISPIncubatorOnlinePlatformEntitiesInstance.AgreementTemplate.FirstOrDefault(
                        p => p.IncubatorID == incubatorApply.IncubatorID);
                    if (agreementTemplate != null)
                    {
                        AgreementTemplateDTO agreementTemplateDto = new AgreementTemplateDTO();
                        agreementTemplateDto.AttachmentID = agreementTemplate.AttachmentID;
                        agreementTemplateDto.Created = agreementTemplate.Created;
                        agreementTemplateDto.CreatedBy = agreementTemplate.CreatedBy;
                        agreementTemplateDto.FileUrl = Utility.GetServicesUrl() + agreementTemplate.FileUrl;
                        agreementTemplateDto.IncubatorID = agreementTemplate.IncubatorID;
                        agreementTemplateDto.FileName = agreementTemplate.FileName;
                        incubatorApplyDto.AgreementTemplate = agreementTemplateDto;
                    }

                    IncubatorManager incubatorManager = new IncubatorManager();
                    IncubatorInformation incubatorInformation = incubatorManager.GetInfo(incubatorApplyDto.IncubatorID);
                    if (incubatorInformation != null)
                    {
                        incubatorApplyDto.IncubatorName = incubatorInformation.IncubatorName;
                        incubatorApplyDto.IncubatorLogoPath = Utility.GetServicesImageUrl() + incubatorInformation.Logo;
                    }

                    incubatorApplyDto.UserType = userType;

                    listDTO.Add(incubatorApplyDto);
                }

            }
            else
            {
                throw new BadRequestException("[IncubatorApplyManager Method(GetAll): IncubatorApplyRequest conditions is null ]未能正确获取查询条件！");
            }
            //目前还缺少查询的条件
            return listDTO;
        }

        /// <summary>
        /// 根据编号获取孵化器申请
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<IncubatorApplyDTO> GetIncubatorApplyByGuid(Guid id)
        {
            List<IncubatorApplyDTO> list = new List<IncubatorApplyDTO>();
            IncubatorApply incubatorApply =
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.FirstOrDefault(p => p.ApplyID == id);
            if (incubatorApply != null)
            {
                IncubatorApplyDTO incubatorApplyDto = new IncubatorApplyDTO();
                incubatorApplyDto.ApplyID = incubatorApply.ApplyID;
                incubatorApplyDto.ApplyStatus = incubatorApply.ApplyStatus;
                incubatorApplyDto.CompanyName = incubatorApply.CompanyName;
                incubatorApplyDto.CompanyTel = incubatorApply.CompanyTel;
                incubatorApplyDto.ContactTel = incubatorApply.ContactTel;
                incubatorApplyDto.CoreStaffResume = incubatorApply.CoreStaffResume;
                incubatorApplyDto.Email = incubatorApply.Email;
                incubatorApplyDto.Created = incubatorApply.Created;
                incubatorApplyDto.FinancingSituation = incubatorApply.FinancingSituation;
                incubatorApplyDto.IncubatorID = incubatorApply.IncubatorID;
                incubatorApplyDto.TeamMembers = incubatorApply.TeamMembers;
                incubatorApplyDto.ProductDescription = incubatorApply.ProductDescription;
                incubatorApplyDto.ProjectOwner = incubatorApply.ProjectOwner;
                incubatorApplyDto.ProjectName = incubatorApply.ProjectName;
                incubatorApplyDto.MarketRiskAnalysis = incubatorApply.MarketRiskAnalysis;
                incubatorApplyDto.IsSign = incubatorApply.IsSign;
                incubatorApplyDto.CreatedBy = incubatorApply.CreatedBy;

                incubatorApplyDto.AppDate = incubatorApply.Created.ToString("yyyy-MM-dd");
                incubatorApplyDto.AppUserName = incubatorApply.User.UserName;
                incubatorApplyDto.ApplyStatusDes = GetIncubatorApplyStatus(incubatorApply.ApplyStatus);


                IncubatorManager incubatorManager = new IncubatorManager();
                IncubatorInformation incubatorInformation = incubatorManager.GetInfo(incubatorApplyDto.IncubatorID);
                if (incubatorInformation != null)
                {
                    incubatorApplyDto.IncubatorName = incubatorInformation.IncubatorName;
                    incubatorApplyDto.IncubatorLogoPath = Utility.GetServicesImageUrl() + incubatorInformation.Logo;
                }

                string type = SISPIncubatorOnlineEnum.ApplyType.IncubatorApply.GetHashCode().ToString();
                List<ApproveRecord> listApproveRecord =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Where(
                        p => p.ApproveRelateID == id && p.ApplyType == type).OrderByDescending(p => p.Created).ToList();
                List<ApproveRecordDTO> listApproveRecordDtos = new List<ApproveRecordDTO>();
                foreach (ApproveRecord approveRecord in listApproveRecord)
                {
                    ApproveRecordDTO approveRecordDto = new ApproveRecordDTO();
                    approveRecordDto.Applicant = approveRecord.Applicant;
                    approveRecordDto.ApproveRelateID = approveRecord.ApproveRelateID;
                    approveRecordDto.ApplyType = approveRecord.ApplyType;
                    approveRecordDto.ApproveNode = approveRecord.ApproveNode;
                    approveRecordDto.ApproveResult = approveRecord.ApproveResult;
                    approveRecordDto.Approver = approveRecord.Approver;
                    approveRecordDto.ApplicantUserName = approveRecord.User.UserName;
                    approveRecordDto.ApproverUser = approveRecord.User1.UserName;
                    approveRecordDto.Created = approveRecord.Created;

                    approveRecordDto.CreatedDate = approveRecord.Created.ToString("yyyy-MM-dd");

                    approveRecordDto.Comments = approveRecord.Comments;
                    approveRecordDto.RecordID = approveRecord.RecordID;

                    listApproveRecordDtos.Add(approveRecordDto);
                }
                incubatorApplyDto.ApproveRecords = listApproveRecordDtos;

                List<AgreementAttachment> listAttachments =
                    SISPIncubatorOnlinePlatformEntitiesInstance.AgreementAttachment.Where(p => p.IncubatorApplyID == id)
                        .ToList();
                List<AgreementAttachmentDTO> listAttachmentDtos = new List<AgreementAttachmentDTO>();
                foreach (AgreementAttachment agreementAttachment in listAttachments)
                {
                    AgreementAttachmentDTO agreementAttachmentDto = new AgreementAttachmentDTO();
                    agreementAttachmentDto.AttachementID = agreementAttachment.AttachementID;
                    agreementAttachmentDto.Created = agreementAttachment.Created;
                    agreementAttachmentDto.CreatedBy = agreementAttachment.CreatedBy;
                    agreementAttachmentDto.FileName = agreementAttachment.FileName;
                    agreementAttachmentDto.FileUrl = Utility.GetServicesUrl() + agreementAttachment.FileUrl;
                    agreementAttachmentDto.IncubatorApplyID = agreementAttachment.IncubatorApplyID;
                    listAttachmentDtos.Add(agreementAttachmentDto);
                }
                incubatorApplyDto.ListAttachments = listAttachmentDtos;
                AgreementTemplate agreementTemplate =
                    SISPIncubatorOnlinePlatformEntitiesInstance.AgreementTemplate.FirstOrDefault(
                        p => p.IncubatorID == incubatorApply.IncubatorID);
                if (agreementTemplate != null)
                {
                    AgreementTemplateDTO agreementTemplateDto = new AgreementTemplateDTO();
                    agreementTemplateDto.AttachmentID = agreementTemplate.AttachmentID;
                    agreementTemplateDto.Created = agreementTemplate.Created;
                    agreementTemplateDto.CreatedBy = agreementTemplate.CreatedBy;
                    agreementTemplateDto.FileUrl = Utility.GetServicesUrl() + agreementTemplate.FileUrl;
                    agreementTemplateDto.IncubatorID = agreementTemplate.IncubatorID;
                    agreementTemplateDto.FileName = agreementTemplate.FileName;
                    incubatorApplyDto.AgreementTemplate = agreementTemplateDto;
                }

                list.Add(incubatorApplyDto);

            }
            else
            {
                throw new BadRequestException("[IncubatorApplyManager Method(GetIncubatorApplyByGuid): incubatorApply  is null ]无法查询对应ID为：！" + id + "的孵化器申请");
            }
            return list;
        }

        /// <summary>
        /// 新增孵化器申请(包含孵化器审批)
        /// </summary>
        /// <param name="incubatorApplyCreateRequest"></param>
        /// <returns></returns>
        public void Add(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            User user = UserHelper.CurrentUser;

            IncubatorApply incubatorApply = incubatorApplyCreateRequest.IncubatorApply;

            string status = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.Pending.GetHashCode().ToString();
            if (incubatorApplyCreateRequest.IncubatorApply != null && incubatorApplyCreateRequest.Incubators != "")
            {
                if (incubatorApplyCreateRequest.Incubators.IndexOf(";", StringComparison.OrdinalIgnoreCase) < 0)
                {
                    throw new BadRequestException(
                        "[IncubatorApplyManager Method(Add): incubatorApplyCreateRequest.Incubators.length<0 ]孵化器为空,未能正确提交孵化器申请！");
                }
                else
                {
                    string incubators = incubatorApplyCreateRequest.Incubators.Substring(1);
                    string[] incubatorArry = incubators.Split(';');
                    foreach (string s in incubatorArry)
                    {
                        if (!string.IsNullOrEmpty(s) && !CheckIncubatorApply(user, s, status))
                        {
                            IncubatorApply incubatorApplyNew = IncubatorApplyToNewIncubatorApply(incubatorApply);

                            Guid guid = Guid.NewGuid();
                            incubatorApplyNew.ApplyID = guid;

                            incubatorApplyNew.IncubatorID = new Guid(s);

                            incubatorApplyNew.Created = DateTime.Now;
                            incubatorApplyNew.CreatedBy = user.UserID;

                            incubatorApplyNew.ApplyStatus = status;
                            incubatorApplyNew.IsSign = false;

                            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Add(incubatorApplyNew);
                            //审批记录
                            ApproveRecord approveRecord = new ApproveRecord();
                            approveRecord.ApproveRelateID = guid;
                            approveRecord.RecordID = Guid.NewGuid();
                            approveRecord.Created = DateTime.Now;
                            approveRecord.ApplyType =
                                SISPIncubatorOnlineEnum.ApplyType.IncubatorApply.GetHashCode().ToString();
                            approveRecord.ApproveNode =
                                SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                            approveRecord.ApproveResult =
                                SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                            approveRecord.Applicant = user.UserID;
                            approveRecord.Approver = user.UserID;
                            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                        }
                        else
                        {
                            string incubatorName = string.Empty;
                            IncubatorManager incubatorManager = new IncubatorManager();
                            IncubatorInformation incubatorInformation =
                                incubatorManager.GetInfo(new Guid(s));
                            if (incubatorInformation != null)
                            {
                                incubatorName = incubatorInformation.IncubatorName;
                            }
                            throw new BadRequestException("[IncubatorApplyManager Method(Add): ] 孵化器：" + incubatorName +
                                                          "在其他入驻申请中已申请，并且未通过，请检查！");
                        }
                    }
                }

                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[IncubatorApplyManager Method(Add): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确提交孵化器申请数据！");
                }

            }
            else
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Add): incubatorApplyCreateRequest.IncubatorApply is fail]未能正确提交孵化器申请数据！");
            }

        }
        /// <summary>
        /// 修改孵化器申请(包含孵化器审批)
        /// </summary>
        /// <param name="incubatorApplyCreateRequest"></param>
        /// <returns></returns>
        public void Update(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            Guid applid = new Guid();
            User user = UserHelper.CurrentUser;
            if (incubatorApplyCreateRequest.IncubatorApply != null)
            {
                applid = incubatorApplyCreateRequest.IncubatorApply.ApplyID;
                IncubatorApply incubatorApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.FirstOrDefault(m => m.ApplyID == applid);
                if (incubatorApply != null)
                {
                    bool isAdminModify = incubatorApplyCreateRequest.IncubatorApply!=null&&incubatorApplyCreateRequest.IncubatorApply.ApplyStatus == "resumbit";

                    incubatorApply = IncubatorApplyDTOToIncubatorApply(incubatorApplyCreateRequest.IncubatorApply, incubatorApply);

                    //审批记录
                    if (isAdminModify)
                    {
                        ApproveRecord approveRecord = new ApproveRecord();
                        approveRecord.ApproveRelateID = applid;
                        approveRecord.RecordID = Guid.NewGuid();
                        approveRecord.Created = DateTime.Now;
                        approveRecord.ApplyType =
                            SISPIncubatorOnlineEnum.ApplyType.IncubatorApply.GetHashCode().ToString();
                        approveRecord.ApproveNode =
                            SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                            SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                        approveRecord.Applicant = user.UserID;
                        approveRecord.Approver = user.UserID;
                        SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                    }

                }
                else
                {
                    throw new BadRequestException("[IncubatorApplyManager Method(Update): incubatorApply is null ]未能正确更新孵化器申请数据！");
                }
            }
            else
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Update): incubatorApply is null ]未能正确更新孵化器申请数据！");
            }
            if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确更新孵化器申请数据！");
            }
        }
        /// <summary>
        /// 审批
        /// </summary>
        /// <param name="incubatorApplyCreateRequest"></param>
        /// <returns></returns>
        public void UpdateApplyStatusAndApprove(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            Guid applid = new Guid();
            User user = UserHelper.CurrentUser;

            MessageManager messageManager=new MessageManager();

            if (incubatorApplyCreateRequest.IncubatorApply != null && incubatorApplyCreateRequest.ApproveStatus != null)
            {
                applid = incubatorApplyCreateRequest.IncubatorApply.ApplyID;
                IncubatorApply incubatorApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.FirstOrDefault(m => m.ApplyID == applid);
                
                if (incubatorApply != null)
                {
                    string applyUserId = incubatorApply.CreatedBy.ToString();
                    ApproveRecord approveRecord = new ApproveRecord();
                    //品牌孵化器通过
                    if (incubatorApplyCreateRequest.ApproveStatus == "1")
                    {
                        incubatorApply.ApplyStatus = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.BrandIncubatorApproved.GetHashCode().ToString();
                        approveRecord.ApproveNode =
                       SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                       SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                        messageManager.CreateSystemMessage(applyUserId, "孵化器申请已审批通过，请查看详情！");
                    }
                    //品牌孵化器退回
                    else if (incubatorApplyCreateRequest.ApproveStatus == "0")
                    {
                        incubatorApply.ApplyStatus = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.BrandIncubatorDismissed.GetHashCode().ToString();
                        approveRecord.ApproveNode =
                       SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                       SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        messageManager.CreateSystemMessage(applyUserId, "孵化器申请已驳回，请查看详情！");
                    }
                    //超级管理员审核
                    else if (incubatorApplyCreateRequest.ApproveStatus == "2")
                    {
                        if (incubatorApply.ApplyStatus ==
                            SISPIncubatorOnlineEnum.ApproveIncubatorStatus.Pending.GetHashCode().ToString())
                        {
                            incubatorApply.ApplyStatus =
                                SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorApproved.GetHashCode()
                                    .ToString();
                            approveRecord.ApproveNode =
                                SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                            approveRecord.ApproveResult =
                                SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                            
                        }
                        else
                        {
                            incubatorApply.ApplyStatus =
                               SISPIncubatorOnlineEnum.ApproveIncubatorStatus.BrandIncubatorApproved.GetHashCode()
                                   .ToString();
                            approveRecord.ApproveNode =
                                SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                            approveRecord.ApproveResult =
                                SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                            messageManager.CreateSystemMessage(applyUserId, "孵化器申请已审批通过，请查看详情！");
                        }
                    }//公共管理员审核
                    else if (incubatorApplyCreateRequest.ApproveStatus == "3")
                    {
                        incubatorApply.ApplyStatus =
                            SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorApproved.GetHashCode()
                                .ToString();
                        approveRecord.ApproveNode =
                            SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                            SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                    }//超级管理员退回
                    else if (incubatorApplyCreateRequest.ApproveStatus == "4")
                    {
                        if (incubatorApply.ApplyStatus ==
                            SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorApproved.GetHashCode().ToString())
                        {
                            incubatorApply.ApplyStatus =
                                SISPIncubatorOnlineEnum.ApproveIncubatorStatus.BrandIncubatorDismissed.GetHashCode()
                                    .ToString();
                            approveRecord.ApproveNode =
                                SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                            approveRecord.ApproveResult =
                                SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                            messageManager.CreateSystemMessage(applyUserId, "孵化器申请已驳回，请查看详情！");
                        }
                        else
                        {
                            incubatorApply.ApplyStatus =
                               SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorDismissed.GetHashCode()
                                   .ToString();
                            approveRecord.ApproveNode =
                                SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                            approveRecord.ApproveResult =
                                SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                            messageManager.CreateSystemMessage(applyUserId, "孵化器申请已驳回，请查看详情！");
                        }
                    }//公共孵化器退回
                    else if (incubatorApplyCreateRequest.ApproveStatus == "5")
                    {
                        incubatorApply.ApplyStatus =
                               SISPIncubatorOnlineEnum.ApproveIncubatorStatus.PublicIncubatorDismissed.GetHashCode()
                                   .ToString();
                        approveRecord.ApproveNode =
                            SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                            SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        messageManager.CreateSystemMessage(applyUserId, "孵化器申请已驳回，请查看详情！");
                    }
                    //审批记录
                    approveRecord.ApproveRelateID = applid;
                    approveRecord.RecordID = Guid.NewGuid();
                    approveRecord.Created = DateTime.Now;
                    approveRecord.ApplyType =
                        SISPIncubatorOnlineEnum.ApplyType.IncubatorApply.GetHashCode().ToString();
                    approveRecord.Applicant = user.UserID;
                    // ReSharper disable once ConvertConditionalTernaryToNullCoalescing
                    approveRecord.Comments = (incubatorApplyCreateRequest.Comments != null ? incubatorApplyCreateRequest.Comments : "");
                    approveRecord.Approver = user.UserID;
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
                }
                else
                {
                    throw new BadRequestException("[IncubatorApplyManager Method(Update): incubatorApply is null ]未能正确更新孵化器申请数据！");
                }
            }
            else
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Update): incubatorApply is null ]未能正确更新孵化器申请数据！");
            }
            if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确更新孵化器申请数据！");
            }
        }
        /// <summary>
        /// 删除孵化器申请以及明细,审批历史
        /// </summary>
        /// <param name="applyId"></param>
        /// <returns></returns>
        public void Delete(Guid applyId)
        {
            var incubatorApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.FirstOrDefault(m => m.ApplyID == applyId);
            ApproveRecordRequest conditions = new ApproveRecordRequest();
            if (incubatorApply != null)
            {

                List<ApproveRecord> approveRecords =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Where(p => p.ApproveRelateID == applyId)
                        .ToList();
                SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.RemoveRange(approveRecords);
            }
            else
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Delete): incubatorApply is null id=" + applyId + "]未能正确删除孵化器申请数据！");
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Remove(incubatorApply);
            if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
            {
                throw new BadRequestException("[IncubatorApplyManager Method(Delete): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail id=" + applyId + "]未能正确删除孵化器申请数据！");
            }
        }
        //<summary>
        //IncubatorApply TO IncubatorApplyDTO
        //</summary>
        //<param name="incubatorApply"></param>
        //<returns></returns>
        private IncubatorApply IncubatorApplyToNewIncubatorApply(IncubatorApply incubatorApply)
        {
            IncubatorApply incubatorApplyDto = new IncubatorApply();
            if (incubatorApply != null)
            {
                incubatorApplyDto.ApplyID = incubatorApply.ApplyID;
                incubatorApplyDto.ProjectName = incubatorApply.ProjectName;
                incubatorApplyDto.CompanyName = incubatorApply.CompanyName;
                incubatorApplyDto.CompanyTel = incubatorApply.CompanyTel;
                incubatorApplyDto.ProjectOwner = incubatorApply.ProjectOwner;
                incubatorApplyDto.ContactTel = incubatorApply.ContactTel;
                incubatorApplyDto.Email = incubatorApply.Email;
                incubatorApplyDto.TeamMembers = incubatorApply.TeamMembers;
                incubatorApplyDto.ProductDescription = incubatorApply.ProductDescription;
                incubatorApplyDto.CoreStaffResume = incubatorApply.CoreStaffResume;
                incubatorApplyDto.MarketRiskAnalysis = incubatorApply.MarketRiskAnalysis;
                incubatorApplyDto.FinancingSituation = incubatorApply.FinancingSituation;
                incubatorApplyDto.Created = incubatorApply.Created;
                incubatorApplyDto.CreatedBy = incubatorApply.CreatedBy;
            }
            return incubatorApplyDto;
        }
        /// <summary>
        /// IncubatorApplyDTO TO IncubatorApply
        /// </summary>
        /// <param name="incubatorApplyDto"></param>
        /// <returns></returns>
        private IncubatorApply IncubatorApplyDTOToIncubatorApply(IncubatorApply incubatorApplyDto, IncubatorApply incubatorApply)
        {
            if (incubatorApplyDto != null)
            {
                incubatorApply.ApplyID = incubatorApplyDto.ApplyID;
                incubatorApply.ProjectName = incubatorApplyDto.ProjectName;
                incubatorApply.CompanyName = incubatorApplyDto.CompanyName;
                incubatorApply.CompanyTel = incubatorApplyDto.CompanyTel;
                incubatorApply.ProjectOwner = incubatorApplyDto.ProjectOwner;
                incubatorApply.ContactTel = incubatorApplyDto.ContactTel;
                incubatorApply.Email = incubatorApplyDto.Email;
                incubatorApply.TeamMembers = incubatorApplyDto.TeamMembers;
                incubatorApply.ProductDescription = incubatorApplyDto.ProductDescription;
                incubatorApply.CoreStaffResume = incubatorApplyDto.CoreStaffResume;
                incubatorApply.MarketRiskAnalysis = incubatorApplyDto.MarketRiskAnalysis;
                incubatorApply.FinancingSituation = incubatorApplyDto.FinancingSituation;

                if (incubatorApplyDto.ApplyStatus == "resumbit")
                {
                    incubatorApply.ApplyStatus = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.Pending.GetHashCode().ToString();
                }
            }

            return incubatorApply;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="incubatorId"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        private bool CheckIncubatorApply(User user, string incubatorId, string status)
        {
            bool isExist = false;
            List<IncubatorApply> list = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Where(p => p.CreatedBy == user.UserID && p.ApplyStatus == status).ToList();
            foreach (IncubatorApply incubatorApply in list)
            {
                if (Convert.ToString(incubatorApply.IncubatorID) == incubatorId)
                {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        }
        /// <summary>
        /// 执行撤销操作
        /// </summary>
        /// <param name="incubatorApplyCreateRequest"></param>
        public void RevokeIncubatorApply(IncubatorApplyCreateRequest incubatorApplyCreateRequest)
        {
            if (incubatorApplyCreateRequest != null)
            {
                if (incubatorApplyCreateRequest.IncubatorApply != null)
                {
                    Guid guid = incubatorApplyCreateRequest.IncubatorApply.ApplyID;
                    IncubatorApply incubatorApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.FirstOrDefault(p => p.ApplyID == guid);
                    if (incubatorApply != null)
                    {
                        incubatorApply.ApplyStatus = SISPIncubatorOnlineEnum.ApproveIncubatorStatus.Revoke.GetHashCode().ToString();
                    }
                    User user = UserHelper.CurrentUser;
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord();
                    approveRecord.ApproveRelateID = guid;
                    approveRecord.RecordID = Guid.NewGuid();
                    approveRecord.Created = DateTime.Now;
                    approveRecord.ApplyType =
                        SISPIncubatorOnlineEnum.ApplyType.IncubatorApply.GetHashCode().ToString();
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
                    throw new BadRequestException("[OfficeApplyManager Method(RevokeIncubatorApply): incubatorApplyCreateRequest is null]Api参数错误！");
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(RevokeIncubatorApply): incubatorApplyCreateRequest is null]Api参数错误！");
            }
        }
        /// <summary>
        /// 执行删除操作
        /// </summary>
        /// <param name="incubatorApplyDeleteRequest"></param>
        public void DeleteIncubatorApply(IncubatorApplyDeleteRequest incubatorApplyDeleteRequest)
        {
            if (incubatorApplyDeleteRequest != null)
            {
                string deleteIds = incubatorApplyDeleteRequest.ApplyIds;
                if (!string.IsNullOrEmpty(deleteIds))
                {
                    string[] strs = deleteIds.Split('|');
                    foreach (string s in strs)
                    {
                        if (!string.IsNullOrEmpty(s))
                        {
                          IncubatorApply incubatorApply=  SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.FirstOrDefault(
                                p => p.ApplyID == new Guid(s));
                            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorApply.Remove(incubatorApply);
                        }
                    }
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(DeleteIncubatorApply): incubatorApplyDeleteRequest is null]Api参数错误！");
            }
        }
        private string GetIncubatorApplyStatus(string code)
        {
            var approveIncubatorStatus =
                from SISPIncubatorOnlineEnum.ApproveIncubatorStatus e in Enum.GetValues(typeof(SISPIncubatorOnlineEnum.ApproveIncubatorStatus))
                select new EnumTmp()
                {
                    Value = (Convert.ToInt32(e).ToString()),
                    Text = e.ToString(),
                    Description = SISPIncubatorOnlineEnum.GetDescription(e)
                };
            var approveIncubatorStatusModel =
                approveIncubatorStatus.ToList().FirstOrDefault(p => p.Value.ToString() == code);
            if (approveIncubatorStatusModel != null)
            {
                return approveIncubatorStatusModel.Description;
            }
            else
            {
                return "";
            }
        }
        /// <summary>
        /// 判断当前登陆人是否属于某个角色
        /// </summary>
        /// <param name="des"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        private bool CheckIsAdminByDes(string des, User user)
        {
            bool IsAdmin = false;
            foreach (User_Roles userRoles in user.User_Roles)
            {
                Roles roles = userRoles.Roles;
                if (roles != null && roles.RoleName == des)
                {
                    IsAdmin = true;
                    break;
                }
            }
            return IsAdmin;
        }
    }

    public class EnumTmp
    {
        public string Value { get; set; }
        public string Text { get; set; }
        public string Description { get; set; }
    }
}