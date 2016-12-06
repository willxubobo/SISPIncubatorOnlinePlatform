using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class ApproveRecordManager : BaseManager
    {
        /// <summary>
        /// 根据查询条件获取所有投资人信息
        /// </summary>
        /// <returns></returns>
        public List<ApproveRecordDTO> GetAll(ApproveRecordRequest conditions)
        {
            List<ApproveRecord> list = new List<ApproveRecord>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                list = SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.OrderBy(p => p.Created)
                    .Skip(pageSize * pageIndex)
                    .Take(pageSize)
                    .ToList();
                //目前还缺少查询的条件
            }
            else
            {
                list = SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.OrderBy(p => p.Created)
                    .ToList<ApproveRecord>();
            }
            List<ApproveRecordDTO> dtoList = new List<ApproveRecordDTO>();
            Utility.CopyList<ApproveRecord, ApproveRecordDTO>(list, dtoList);
            return dtoList;
        }

        /// <summary>
        /// 获取我的申请信息
        /// </summary>
        public List<ApproveRecord> GetMyApply(ApproveRecordRequest conditions)
        {
            User user = UserHelper.CurrentUser;
            if (conditions == null)
            {
                throw new BadRequestException("[未获取到我的申请查询条件]查询失败！");
            }
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            string sql =
                    " SELECT * FROM [ApproveRecord] WHERE [Created] IN (SELECT MAX([Created]) FROM [ApproveRecord] GROUP BY applytype,approverelateid) and [Applicant]=@Applicant order by [Created] desc";
            SqlParameter[] para = new SqlParameter[]
                {
                    new SqlParameter("@Applicant", user.UserID)
                };
           List<ApproveRecord> list = SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.SqlQuery(sql, para).Skip(pageSize * pageIndex).Take(pageSize).ToList();
            return list;
        }

        /// <summary>
        /// 获取审批记录
        /// </summary>
        public ApproveRecordResponse GetApproveInfo(ApproveRecordRequest conditions)
        {
            if (conditions == null)
            {
                throw new BadRequestException("[未获取到我的申请查询条件]查询失败！");
            }
            //string sql =
            //        " SELECT * FROM [ApproveRecord] WHERE [ApproveRelateID]=@ApproveRelateID order by [Created] desc";
            //SqlParameter[] para = new SqlParameter[]
            //    {
            //        new SqlParameter("@ApproveRelateID", conditions.ApproveRelateID)
            //    };

            ApproveRecordResponse approveRecordResponse = new ApproveRecordResponse();
            var approverRecords = from a in SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord
                       join b in SISPIncubatorOnlinePlatformEntitiesInstance.User
                       on a.Approver equals b.UserID
                       join c in SISPIncubatorOnlinePlatformEntitiesInstance.User
                       on a.Applicant equals c.UserID
                       where a.ApproveRelateID.ToString() == conditions.ApproveRelateID
                       orderby a.Created descending
                       select new ApproveRecordDTO()
                       {
                           RecordID = a.RecordID,
                           ApproveRelateID = a.ApproveRelateID,
                           ApproveNode = a.ApproveNode,
                           Comments = a.Comments,
                           ApproveResult = a.ApproveResult,
                           Approver = a.Approver,
                           ApplyType = a.ApplyType,
                           Applicant = a.Applicant,
                           Created = a.Created,
                           ApproverUser = b.UserName,
                           ApplicantUserName = c.UserName
                       };
            var list = approverRecords.ToList<ApproveRecordDTO>();
            approveRecordResponse.Results = list;
            return approveRecordResponse;
        }

        //审批操作
        public void ApproveOperate(ApproveRecordRequest conditions)
        {
            User user = UserHelper.CurrentUser;
            ApproveRecord approveRecord = new ApproveRecord();
            //审批记录
            Guid id = Guid.Parse(conditions.ApproveRelateID);
            approveRecord.ApproveRelateID = id;
            approveRecord.RecordID = Guid.NewGuid();
            approveRecord.Created = DateTime.Now;
            string applyUserId = string.Empty;
            if (conditions.ApplyType == "InvestorApply")
            {
                var InvestorApply = SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.Where(x => x.UserID == id).FirstOrDefault();
                InvestorApply.Status = conditions.ApproveStatus;
                approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.InvestorApply.GetHashCode().ToString();
                applyUserId = InvestorApply.UserID.ToString();
            }
            else if (conditions.ApplyType == "FinancingApply")
            {
                var FinancingApply = SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Where(x => x.FRID == id).FirstOrDefault();
                FinancingApply.Status = conditions.ApproveStatus;
                approveRecord.ApplyType = SISPIncubatorOnlineEnum.ApplyType.FinancingApply.GetHashCode().ToString();
                applyUserId = FinancingApply.CreatedBy.ToString();
            }
            approveRecord.Applicant = user.UserID;
            // ReSharper disable once ConvertConditionalTernaryToNullCoalescing
            approveRecord.Comments = conditions.Comments;
            approveRecord.Approver = user.UserID;
            approveRecord.ApproveResult = conditions.ApproveStatus;
            MessageManager messageManager = new MessageManager();
            if (conditions.ApproveStatus == "2")
            {
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Approved.GetHashCode().ToString();
                if (conditions.ApplyType == "InvestorApply")
                {
                    messageManager.CreateSystemMessage(applyUserId, "您的投资机构申请审批已通过，请查看详情！");
                }
                else if (conditions.ApplyType == "FinancingApply")
                {
                    messageManager.CreateSystemMessage(applyUserId, "您的融资项目申请审批已通过，请查看详情！");
                }
            }
            else
            {
                approveRecord.ApproveNode = SISPIncubatorOnlineEnum.ApproveStatus.Dismissed.GetHashCode().ToString();
                if (conditions.ApplyType == "InvestorApply")
                {
                    messageManager.CreateSystemMessage(applyUserId, "您的投资机构申请审批已驳回，请查看详情！");
                }
                else if (conditions.ApplyType == "FinancingApply")
                {
                    messageManager.CreateSystemMessage(applyUserId, "您的融资项目申请审批已驳回，请查看详情！");
                }
            }

            SISPIncubatorOnlinePlatformEntitiesInstance.ApproveRecord.Add(approveRecord);
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }
    }
}