using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Common
{
    public class SISPIncubatorOnlineEnum
    {
        /// <summary>
        /// 关注类型
        /// </summary>
        public enum FollowType
        {
            [Description("融资项目关注")]
            Financing = 0,
            [Description("投资人关注")]
            Investor = 1,
        }
        /// <summary>
        /// 审批状态
        /// </summary>
        public enum ApproveStatus
        {
            [Description("提交申请")]
            Propose = 0,
            [Description("待审核")]
            Pending = 1,
            [Description("审核通过")]
            Approved = 2,
            [Description("审核驳回")]
            Dismissed = 3,
            [Description("撤销")]
            Revoke = 4,
            [Description("全部")]
            All = 5
        }
        public enum ApproveIncubatorStatus
        {
            [Description("提交申请")]
            Propose = 0,
            [Description("公共孵化器审核中")]
            Pending = 1,
            [Description("品牌孵化器审核中")]
            PublicIncubatorApproved = 2,
            [Description("公共孵化器审核驳回")]
            PublicIncubatorDismissed = 3,
            [Description("审核通过")]
            BrandIncubatorApproved = 4,
            [Description("品牌孵化器审核驳回")]
            BrandIncubatorDismissed = 5,
            [Description("撤销")]
            Revoke = 6,
        }

        public enum ApplyType
        {
            [Description("孵化器入驻申请")]
            IncubatorApply = 0,
            [Description("办公室入驻申请")]
            OffceApply = 1,
            [Description("投资人资格申请")]
            InvestorApply = 2,
            [Description("融资发布申请")]
            FinancingApply = 3,
            [Description("服务发布申请")]
            ServiceApply = 4,
            [Description("需求发布申请")]
            DemandApply = 5,
            [Description("活动发布申请")]
            ActivityApply = 6,
            [Description("举办孵化器活动申请")]
            IncubatorActivityApply = 7
        }

        public enum ApiReturnStatus
        {
            [Description("成功")]
            Success = 0,
            [Description("失败")]
            Fail = 1,
            [Description("已存在")]
            Exist = 2,
            [Description("对象为空")]
            ObjectNull = 3,
            [Description("验证码错误")]
            CodeError = 4,
        }

        public enum FieldStatus
        {
            [Description("失效")]
            Fail = 0,
            [Description("有效")]
            Effect = 1,
        }

        public enum BasicDataModuleType
        {
            [Description("产品分类")]
            ProductClass = 0,
            [Description("投资阶段管理")]
            InvestmentStageManagement = 1,
            [Description("备注信息管理")]
            RemarksInformationManagement = 2,
            [Description("行业分类管理")]
            CategoryManagement = 3,
        }

        public static string GetDescription(Enum en)
        {
            Type type = en.GetType();

            MemberInfo[] memInfo = type.GetMember(en.ToString());

            if (memInfo != null && memInfo.Length > 0)
            {
                object[] attrs = memInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (attrs != null && attrs.Length > 0)
                {
                    return ((DescriptionAttribute)attrs[0]).Description;
                }
            }

            return en.ToString();
        }

        public enum ActivityCategory
        {
            [Description("活动发布申请")]
            ActivityPublishApply = 0,
            [Description("举办孵化器活动申请")]
            IncubatorActivityApply = 1,
        }

        public enum BiddingCategory
        {
            [Description("需求")]
            DemandPublish = 0,
            [Description("服务")]
            Service = 1,
        }
        public enum MessageType
        {
            [Description("系统消息")]
            SystemMsg = 0,
            [Description("聊天会话")]
            ChartMsg = 1,
        }


        public enum MessageStatus
        {
            [Description("未读")]
            Unread = 0,
            [Description("已读")]
            Read = 1,
        }

        public enum ProjectType
        {
            [Description("已注册")]
            Registered = 0,
            [Description("孵化中")]
            Hatching = 1,
            [Description("孵化完成")]
            Incubatored = 2,
            [Description("寻求融资")]
            SeekFinancing = 3,
        }

        public enum PermissionControl
        {
            [Description("访客")]
            Vistor = 0,
            [Description("仅登陆")]
            Login = 1,
            [Description("仅投资人")]
            Investor = 2
        }
    }
}