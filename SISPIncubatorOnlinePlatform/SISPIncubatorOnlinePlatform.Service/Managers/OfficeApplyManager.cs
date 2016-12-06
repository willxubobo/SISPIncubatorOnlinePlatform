using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System.Configuration;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class OfficeApplyManager : BaseManager
    {
        /// <summary>
        /// 根据条件查询记录
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public List<OfficeApplyDTO> GetAllByCondition(OfficeApplyRequest conditions, out int totalCount)
        {
            List<OfficeApply> list = new List<OfficeApply>();
            List<OfficeApplyDTO> lsitOfficeApplyDtos = new List<OfficeApplyDTO>();
            List<OfficeApplyWorkExperienceDTO> litsApplyWorkExperienceDtos = null;

            if (conditions != null)
            {
                string operModel = conditions.OperModel;
                string keyWord = conditions.KeyWord;
                User user = UserHelper.CurrentUser;

                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);

                if (!string.IsNullOrEmpty(operModel) && operModel == "my")
                {
                    string status = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();

                    List<OfficeApply> listTmp =
                        SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Where(
                            p =>
                                p.CreatedBy == user.UserID && p.ApplyStatus != status &&
                                (p.Address.Contains(keyWord) || p.CompanyName.Contains(keyWord) || p.Email.Contains(keyWord) || p.ProjectOwner.Contains(keyWord) || p.ProductDescription.Contains(keyWord)))
                            .OrderByDescending(p => p.Created)
                            .ToList();
                    totalCount = listTmp.Count;
                    list = listTmp.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<OfficeApply>();
                }
                else if (operModel == "adminapprove")
                {
                    //筛选所有待审核的
                    //string status = SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                    string status = conditions.Status;
                    List<OfficeApply> listTmp =
                        SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Where(
                            p => p.ApplyStatus == status &&
                                (p.Address.Contains(keyWord) || p.CompanyName.Contains(keyWord) ||
                                 p.Email.Contains(keyWord) || p.ProjectOwner.Contains(keyWord) ||
                                 p.ProductDescription.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                    totalCount = listTmp.Count;
                    list = listTmp.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<OfficeApply>();
                }
                else if (operModel == "admin")
                {
                    string status = conditions.Status;
                    List<OfficeApply> listTmp;
                    if (!string.IsNullOrEmpty(status))
                    {
                        listTmp =
                            SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Where(
                                p => p.ApplyStatus == status &&
                                     (p.Address.Contains(keyWord) || p.CompanyName.Contains(keyWord) ||
                                      p.Email.Contains(keyWord) || p.ProjectOwner.Contains(keyWord) ||
                                      p.ProductDescription.Contains(keyWord)))
                                .OrderByDescending(p => p.Created)
                                .ToList();
                    }
                    else
                    {
                        listTmp =
                            SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Where(
                                p =>
                                    (p.Address.Contains(keyWord) || p.CompanyName.Contains(keyWord) ||
                                     p.Email.Contains(keyWord) || p.ProjectOwner.Contains(keyWord) ||
                                     p.ProductDescription.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                    }
                    totalCount = listTmp.Count;
                    list = listTmp.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<OfficeApply>();


                }
                else
                {
                    List<OfficeApply> listTmp =
                        SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Where(
                            p =>
                                (p.Address.Contains(keyWord) || p.CompanyName.Contains(keyWord) ||
                                 p.Email.Contains(keyWord) || p.ProjectOwner.Contains(keyWord) ||
                                 p.ProductDescription.Contains(keyWord))).OrderByDescending(p => p.Created).ToList();
                    totalCount = listTmp.Count;
                    list = listTmp.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<OfficeApply>();

                }

                foreach (OfficeApply officeApply in list)
                {
                    OfficeApplyDTO officeApplyDto = new OfficeApplyDTO();
                    officeApplyDto.ApplyID = officeApply.ApplyID;
                    officeApplyDto.ProjectOwner = officeApply.ProjectOwner;
                    officeApplyDto.Gender = officeApply.Gender;
                    officeApplyDto.Degree = officeApply.Degree;
                    officeApplyDto.Specialty = officeApply.Specialty;
                    officeApplyDto.Address = officeApply.Address;
                    officeApplyDto.PhoneNumber = officeApply.PhoneNumber;
                    officeApplyDto.Email = officeApply.Email;
                    officeApplyDto.Diplomas = officeApply.Diplomas;
                    officeApplyDto.IntellectualProperty = officeApply.IntellectualProperty;
                    officeApplyDto.CompanyName = officeApply.CompanyName;
                    officeApplyDto.RegisteredCapital = officeApply.RegisteredCapital;
                    officeApplyDto.DemandForSpace = officeApply.DemandForSpace;
                    officeApplyDto.InitialStaff = officeApply.InitialStaff;
                    officeApplyDto.ProductDescription = officeApply.ProductDescription;
                    officeApplyDto.MemberDescription = officeApply.MemberDescription;
                    officeApplyDto.FinancingAndRevenue = officeApply.FinancingAndRevenue;
                    officeApplyDto.ApplyStatus = officeApply.ApplyStatus;
                    officeApplyDto.ApplyStatusDes = GetApplyStatusDesc(officeApply.ApplyStatus);
                    officeApplyDto.CreatedBy = officeApply.CreatedBy;
                    officeApplyDto.Created = officeApply.Created;
                    officeApplyDto.CreatedDate = officeApply.Created.ToString("yyyy-MM-dd");

                    officeApplyDto.AppDate = officeApply.Created.ToString("yyyy-MM-dd");
                    officeApplyDto.AppUserName = officeApply.User.UserName;

                    litsApplyWorkExperienceDtos = new List<OfficeApplyWorkExperienceDTO>();

                    foreach (OfficeApplyWorkExperience officeApplyWorkExperience in officeApply.OfficeApplyWorkExperience)
                    {
                        OfficeApplyWorkExperienceDTO officeApplyWorkExperienceDto = new OfficeApplyWorkExperienceDTO();
                        officeApplyWorkExperienceDto.ApplyID = officeApplyWorkExperience.ApplyID;
                        officeApplyWorkExperienceDto.EndDate = officeApplyWorkExperience.EndDate;
                        officeApplyWorkExperienceDto.StartDate = officeApplyWorkExperience.StartDate;
                        officeApplyWorkExperienceDto.SchoolOrEmployer = officeApplyWorkExperience.SchoolOrEmployer;
                        officeApplyWorkExperienceDto.JobTitle = officeApplyWorkExperience.JobTitle;
                        officeApplyWorkExperienceDto.WEID = officeApplyWorkExperience.WEID;
                        litsApplyWorkExperienceDtos.Add(officeApplyWorkExperienceDto);
                    }
                    officeApplyDto.OfficeApplyWorkExperienceDtos = litsApplyWorkExperienceDtos;

                    lsitOfficeApplyDtos.Add(officeApplyDto);
                }


            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(GetAllByCondition): OfficeApplyRequest is null;]未能正确获取查询条件！");
            }
            //缺少查询条件
            return lsitOfficeApplyDtos;
        }

        /// <summary>
        /// 新增一条记录
        /// </summary>
        /// <param name="officeApplyCreateRequest"></param>
        /// <returns></returns>
        public void Add(OfficeApplyCreateRequest officeApplyCreateRequest)
        {
            Guid reGuid = Guid.NewGuid();
            string error = "";
            if (officeApplyCreateRequest != null)
            {
                if (officeApplyCreateRequest.OfficeApply != null)
                {
                    OfficeApply officeApply = officeApplyCreateRequest.OfficeApply;

                    officeApply.Created = DateTime.Now;
                    officeApply.ApplyID = reGuid;

                    User user = UserHelper.CurrentUser;
                    officeApply.CreatedBy = user.UserID;
                    officeApply.ApplyStatus = SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();

                    if (officeApply.OfficeApplyWorkExperience != null)
                    {
                        foreach (
                            OfficeApplyWorkExperience officeApplyWorkExperience in
                                officeApply.OfficeApplyWorkExperience)
                        {
                            officeApplyWorkExperience.WEID = Guid.NewGuid();
                        }
                    }
                    else
                    {
                        throw new BadRequestException("[OfficeApplyManager Method(Add): officeApply.OfficeApplyWorkExperience is null]未能正确提交用户提交的办公室申请信息！");
                    }
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord();
                    approveRecord.ApproveRelateID = reGuid;
                    approveRecord.RecordID = Guid.NewGuid();
                    approveRecord.Created = DateTime.Now;
                    approveRecord.ApplyType =
                        SISPIncubatorOnlineEnum.ApplyType.OffceApply.GetHashCode().ToString();
                    approveRecord.ApproveNode =
                        SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                    approveRecord.ApproveResult =
                        SISPIncubatorOnlineEnum.ApproveStatus.Propose.GetHashCode().ToString();
                    approveRecord.Applicant = user.UserID;
                    approveRecord.Approver = user.UserID;
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);


                    SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Add(officeApply);
                    if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                    {
                        throw new BadRequestException("[OfficeApplyManager Method(Add): SaveChanges() is fail ]未能正确提交用户提交的办公室申请信息！");
                    }
                    else
                    {
                        //申请成功，发送短信
                        string SMSMobile = string.Empty;
                        string SMSContent = ConfigurationManager.AppSettings["ApplyApproveContent"];
                        SMSContent = string.Format(SMSContent, "办公室入驻");

                        string roleName = ConfigurationManager.AppSettings["PublicIncubatorManager"];

                        UserManager userManager = new UserManager();

                        List<User> userList = userManager.GetUserByRole(roleName);

                        if (userList != null && userList.Count > 0)
                        {
                            foreach (var userInfo in userList)
                            {
                                if (!SMSHelper.SendApplySMS(userInfo.Mobile, SMSContent))
                                {
                                    LoggerHelper.Error("[OfficeApplyManager Method(Add): 发送手机短信失败，手机号：" + userInfo.Mobile +
                                                          ",短信内容：" + SMSContent + "]未能正确发送短信！");

                                    throw new BadRequestException("[OfficeApplyManager Method(Add): 发送手机短信失败，手机号：" + userInfo.Mobile +
                                                          ",短信内容：" + SMSContent + "]未能正确发送短信！");
                                }
                            }
                        }

                    }
                }
                else
                {
                    throw new BadRequestException("[OfficeApplyManager Method(Add): officeApplyCreateRequest.OfficeApply is null]未能正确提交用户提交的办公室申请信息！");
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(Add): officeApplyCreateRequest is null]未能正确提交用户提交的办公室申请信息！");
            }
        }

        /// <summary>
        /// 修改记录
        /// </summary>
        /// <param name="officeApplyCreateRequest"></param>
        /// <returns></returns>
        public void Update(OfficeApplyCreateRequest officeApplyCreateRequest)
        {
            OfficeApply officeApply = new OfficeApply();
            User user = UserHelper.CurrentUser;
            if (officeApplyCreateRequest.OfficeApply != null)
            {
                officeApply = officeApplyCreateRequest.OfficeApply;

                OfficeApply officeApplyDb = SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.FirstOrDefault(p => p.ApplyID == officeApply.ApplyID);

                if (officeApplyDb != null)
                {
                    officeApplyDb.ProjectOwner = officeApply.ProjectOwner;
                    officeApplyDb.Gender = officeApply.Gender;
                    officeApplyDb.Degree = officeApply.Degree;
                    officeApplyDb.Specialty = officeApply.Specialty;
                    officeApplyDb.Address = officeApply.Address;
                    officeApplyDb.PhoneNumber = officeApply.PhoneNumber;
                    officeApplyDb.Email = officeApply.Email;
                    officeApplyDb.Diplomas = officeApply.Diplomas;
                    officeApplyDb.IntellectualProperty = officeApply.IntellectualProperty;
                    officeApplyDb.CompanyName = officeApply.CompanyName;
                    officeApplyDb.RegisteredCapital = officeApply.RegisteredCapital;
                    officeApplyDb.DemandForSpace = officeApply.DemandForSpace;
                    officeApplyDb.InitialStaff = officeApply.InitialStaff;
                    officeApplyDb.ProductDescription = officeApply.ProductDescription;
                    officeApplyDb.MemberDescription = officeApply.MemberDescription;
                    officeApplyDb.FinancingAndRevenue = officeApply.FinancingAndRevenue;

                    bool isAdminModify = officeApply.ApplyStatus == "resubmit";


                    if (officeApply.OfficeApplyWorkExperience != null)
                    {
                        SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApplyWorkExperience.RemoveRange(officeApplyDb.OfficeApplyWorkExperience);
                        if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                        {
                            throw new BadRequestException("[OfficeApplyManager Method(Update):OfficeApplyWorkExperience.RemoveRange(officeApplyDb.OfficeApplyWorkExperience) SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确更新办公室申请数据！");
                        }
                        foreach (OfficeApplyWorkExperience officeApplyWorkExperience in officeApply.OfficeApplyWorkExperience)
                        {
                            officeApplyWorkExperience.WEID = Guid.NewGuid();
                            officeApplyDb.OfficeApplyWorkExperience.Add(officeApplyWorkExperience);
                        }
                    }
                    else
                    {
                        throw new BadRequestException("[OfficeApplyManager Method(Update): officeApply.OfficeApplyWorkExperience is null]未能正确更新办公室申请数据！");
                    }

                    if (!isAdminModify)
                    {
                        officeApplyDb.ApplyStatus = SISPIncubatorOnlineEnum.ApproveStatus.Pending.GetHashCode().ToString();
                        //审批记录
                        ApproveRecord approveRecord = new ApproveRecord();
                        approveRecord.ApproveRelateID = officeApply.ApplyID;
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

                }
                else
                {
                    throw new BadRequestException("[OfficeApplyManager Method(Update): officeApplyDb is null]未能正确更新办公室申请数据！");
                }
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[OfficeApplyManager Method(Update):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确更新办公室申请数据！");
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(Update): officeApplyCreateRequest.OfficeApply is null]未能正确更新办公室申请数据！");
            }
        }
        /// <summary>
        /// 审批办公室租赁
        /// </summary>
        /// <param name="officeApplyCreateRequest"></param>
        public void ApproveOfficeAplly(OfficeApplyCreateRequest officeApplyCreateRequest)
        {
            OfficeApply officeApply = new OfficeApply();
            User user = UserHelper.CurrentUser;
            MessageManager messageManager = new MessageManager();
            if (officeApplyCreateRequest.OfficeApply != null)
            {
                officeApply = officeApplyCreateRequest.OfficeApply;
                //1,通过；0，拒绝；
                string approveStatus = officeApplyCreateRequest.ApproveStatus;
                string comments = officeApplyCreateRequest.Comments;
                OfficeApply officeApplyDb = SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.FirstOrDefault(p => p.ApplyID == officeApply.ApplyID);
                if (officeApplyDb != null)
                {
                    string applyUserId = officeApplyDb.CreatedBy.ToString();
                    ApproveRecord approveRecord = new ApproveRecord();
                    approveRecord.ApproveRelateID = officeApply.ApplyID;
                    if (approveStatus == "1")
                    {
                        officeApplyDb.ApplyStatus = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                        approveRecord.ApproveNode =
                       SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                            SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                        messageManager.CreateSystemMessage(applyUserId, "您的办公室租赁申请已审批通过，请查看详情！");

                    }
                    else
                    {
                        officeApplyDb.ApplyStatus = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        approveRecord.ApproveNode =
                       SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        approveRecord.ApproveResult =
                            SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                        messageManager.CreateSystemMessage(applyUserId, "您的办公室租赁申请已驳回，请查看详情！");
                    }
                    approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.OffceApply.GetHashCode().ToString();
                    approveRecord.Comments = comments;
                    approveRecord.RecordID = Guid.NewGuid();
                    approveRecord.Created = DateTime.Now;
                    approveRecord.Applicant = user.UserID;
                    approveRecord.Approver = user.UserID;
                    SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);

                    if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                    {
                        throw new BadRequestException("[OfficeApplyManager Method(Update):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确提交数据数据！");
                    }
                }

            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(ApproveOfficeAplly): officeApplyCreateRequest.OfficeApply is null] officeApplyCreateRequest.OfficeApply  Api参数不正确！");

            }
        }

        /// <summary>
        /// 删除一项
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void Delete(Guid id)
        {
            OfficeApply officeApply = SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.FirstOrDefault(p => p.ApplyID == id);
            if (officeApply != null)
            {
                if (officeApply.OfficeApplyWorkExperience != null)
                {
                    SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApplyWorkExperience.RemoveRange(officeApply.OfficeApplyWorkExperience);
                }
                else
                {
                    throw new BadRequestException("[OfficeApplyManager Method(Delete): officeApply.OfficeApplyWorkExperience is null id=" + id + "]删除办公室申请数据失败！");
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Remove(officeApply);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[OfficeApplyManager Method(Delete):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail id=" + id + "]删除办公室申请数据失败！");
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(Delete): officeApply is null id=" + id + "]删除办公室申请数据失败！");
            }
        }

        /// <summary>
        /// 获取单个办公室申请的详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<OfficeApplyDTO> GetOfficeApplyByid(Guid id)
        {
            List<OfficeApply> list = SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Where(p => p.ApplyID == id).ToList<OfficeApply>();
            List<OfficeApplyDTO> lsitOfficeApplyDtos = new List<OfficeApplyDTO>();
            List<OfficeApplyWorkExperienceDTO> litsApplyWorkExperienceDtos = null;
            foreach (OfficeApply officeApply in list)
            {
                OfficeApplyDTO officeApplyDto = new OfficeApplyDTO();
                officeApplyDto.ApplyID = officeApply.ApplyID;
                officeApplyDto.ProjectOwner = officeApply.ProjectOwner;
                officeApplyDto.Gender = officeApply.Gender;
                officeApplyDto.Degree = officeApply.Degree;
                officeApplyDto.Specialty = officeApply.Specialty;
                officeApplyDto.Address = officeApply.Address;
                officeApplyDto.PhoneNumber = officeApply.PhoneNumber;
                officeApplyDto.Email = officeApply.Email;
                officeApplyDto.Diplomas = officeApply.Diplomas;
                officeApplyDto.IntellectualProperty = officeApply.IntellectualProperty;
                officeApplyDto.CompanyName = officeApply.CompanyName;
                officeApplyDto.RegisteredCapital = officeApply.RegisteredCapital;
                officeApplyDto.DemandForSpace = officeApply.DemandForSpace;
                officeApplyDto.InitialStaff = officeApply.InitialStaff;
                officeApplyDto.ProductDescription = officeApply.ProductDescription;
                officeApplyDto.MemberDescription = officeApply.MemberDescription;
                officeApplyDto.FinancingAndRevenue = officeApply.FinancingAndRevenue;
                officeApplyDto.ApplyStatus = officeApply.ApplyStatus;
                officeApplyDto.CreatedBy = officeApply.CreatedBy;
                officeApplyDto.Created = officeApply.Created;

                officeApplyDto.AppDate = officeApply.Created.ToString("yyyy-MM-dd");
                officeApplyDto.AppUserName = officeApply.User.UserName;

                litsApplyWorkExperienceDtos = new List<OfficeApplyWorkExperienceDTO>();

                foreach (OfficeApplyWorkExperience officeApplyWorkExperience in officeApply.OfficeApplyWorkExperience)
                {
                    OfficeApplyWorkExperienceDTO officeApplyWorkExperienceDto = new OfficeApplyWorkExperienceDTO();
                    officeApplyWorkExperienceDto.ApplyID = officeApplyWorkExperience.ApplyID;
                    officeApplyWorkExperienceDto.EndDate = officeApplyWorkExperience.EndDate;
                    officeApplyWorkExperienceDto.StartDate = officeApplyWorkExperience.StartDate;
                    officeApplyWorkExperienceDto.SchoolOrEmployer = officeApplyWorkExperience.SchoolOrEmployer;
                    officeApplyWorkExperienceDto.JobTitle = officeApplyWorkExperience.JobTitle;
                    officeApplyWorkExperienceDto.WEID = officeApplyWorkExperience.WEID;
                    litsApplyWorkExperienceDtos.Add(officeApplyWorkExperienceDto);
                }

                string type = SISPIncubatorOnlineEnum.ApplyType.OffceApply.GetHashCode().ToString();
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
                officeApplyDto.ApproveRecords = listApproveRecordDtos;

                officeApplyDto.OfficeApplyWorkExperienceDtos = litsApplyWorkExperienceDtos;

                lsitOfficeApplyDtos.Add(officeApplyDto);
            }
            return lsitOfficeApplyDtos;
        }
        /// <summary>
        /// 获取审批的名称
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public string GetApplyStatusDesc(string value)
        {
            var approveStatus =
                from SISPIncubatorOnlineEnum.ApproveStatus e in Enum.GetValues(typeof(SISPIncubatorOnlineEnum.ApproveStatus))
                select new EnumTmp()
                {
                    Value = (Convert.ToInt32(e).ToString()),
                    Text = e.ToString(),
                    Description = SISPIncubatorOnlineEnum.GetDescription(e)
                };
            var approveStatusModel =
                approveStatus.ToList().FirstOrDefault(p => p.Value.ToString() == value);
            if (approveStatusModel != null)
            {
                return approveStatusModel.Description;
            }
            else
            {
                return "";
            }
        }
        /// <summary>
        /// 执行撤销操作
        /// </summary>
        /// <param name="officeApplyCreateRequest"></param>
        public void RevokeOfficeApply(OfficeApplyCreateRequest officeApplyCreateRequest)
        {
            if (officeApplyCreateRequest != null)
            {
                if (officeApplyCreateRequest.OfficeApply != null)
                {
                    Guid guid = officeApplyCreateRequest.OfficeApply.ApplyID;
                    OfficeApply officeApply = SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.FirstOrDefault(p => p.ApplyID == guid);
                    if (officeApply != null)
                    {
                        officeApply.ApplyStatus = SISPIncubatorOnlineEnum.ApproveStatus.Revoke.GetHashCode().ToString();
                    }
                    User user = UserHelper.CurrentUser;
                    //审批记录
                    ApproveRecord approveRecord = new ApproveRecord();
                    approveRecord.ApproveRelateID = guid;
                    approveRecord.RecordID = Guid.NewGuid();
                    approveRecord.Created = DateTime.Now;
                    approveRecord.ApplyType =
                        SISPIncubatorOnlineEnum.ApplyType.OffceApply.GetHashCode().ToString();
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
                    throw new BadRequestException("[OfficeApplyManager Method(RevokeOfficeApply): officeApplyCreateRequest is null]Api参数错误！");
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(RevokeOfficeApply): officeApplyCreateRequest is null]Api参数错误！");
            }
        }

        /// <summary>
        /// 删除办公室租赁
        /// </summary>
        /// <param name="officeApplyDeleteRequest"></param>
        public void DeleteOfficeApply(OfficeApplyDeleteRequest officeApplyDeleteRequest)
        {
            if (officeApplyDeleteRequest != null)
            {
                string deleteIds = officeApplyDeleteRequest.ApplyIds;
                if (!string.IsNullOrEmpty(deleteIds))
                {
                    string[] strs = deleteIds.Split('|');
                    foreach (string s in strs)
                    {
                        if (!string.IsNullOrEmpty(s))
                        {
                            OfficeApply officeApply = SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.FirstOrDefault(
                                  p => p.ApplyID == new Guid(s));
                            SISPIncubatorOnlinePlatformEntitiesInstance.OfficeApply.Remove(officeApply);
                        }
                    }
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
            }
            else
            {
                throw new BadRequestException("[OfficeApplyManager Method(DeleteOfficeApply): officeApplyDeleteRequest is null]Api参数错误！");
            }
        }
    }

}