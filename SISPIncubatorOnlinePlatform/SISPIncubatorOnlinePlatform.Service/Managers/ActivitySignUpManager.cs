using OfficeOpenXml;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class ActivitySignUpManager : BaseManager
    {
        /// <summary>
        /// 根据id获取活动报名列表
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        public ActivitySignUpResponse GetActivitySignUpByGuid(Guid id)
        {
            ActivitySignUpResponse activitySignUpResponse = new ActivitySignUpResponse();
            var activitySignUp =
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Where(x => x.ActivityID == id).ToList();
            List<ActivitySignUpDTO> dtoList = new List<ActivitySignUpDTO>();
            Utility.CopyList<ActivitySignUp, ActivitySignUpDTO>(activitySignUp, dtoList);
            activitySignUpResponse.Results = dtoList;
            return activitySignUpResponse;
        }

        /// <summary>
        /// 获取我的活动
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public MyActivityResponse GetMyActivity(MyActivityRequest conditions)
        {
            User user = UserHelper.CurrentUser;
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            MyActivityResponse myActivityResponse = new MyActivityResponse();
            var activitySignUps = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Where(x => x.CreatedBy == user.UserID).ToList();
            List<MyActivityDto> myActivityList = new List<MyActivityDto>();
            List<MyActivityDto> timeOutmyActivityList = new List<MyActivityDto>();
            foreach (var activitySignUp in activitySignUps)
            {
                var activityApplies = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityPublishApply.FirstOrDefault(x => x.ActivityID == activitySignUp.ActivityID);
                var incubatorActivityApply = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorActivityApply.FirstOrDefault(x => x.ActivityID == activitySignUp.ActivityID);
                MyActivityDto myActivity = new MyActivityDto();
                if (activityApplies != null)
                {
                    myActivity.Topic = activityApplies.Topic;
                    myActivity.StartTime = activityApplies.StartTime;
                    myActivity.EndTime = activityApplies.EndTime;
                    myActivity.Category = SISPIncubatorOnlineEnum.ActivityCategory.ActivityPublishApply.GetHashCode();

                }
                else
                {
                    if (incubatorActivityApply == null) continue;
                    myActivity.Topic = incubatorActivityApply.Topic;
                    myActivity.StartTime = incubatorActivityApply.StartTime;
                    myActivity.EndTime = incubatorActivityApply.EndTime;
                    myActivity.Category = SISPIncubatorOnlineEnum.ActivityCategory.IncubatorActivityApply.GetHashCode();
                }
                myActivity.ActivityId = activitySignUp.ActivityID;
                myActivity.SignUpID = activitySignUp.SignUpID;
                if (myActivity.EndTime.Day < DateTime.Now.Day)
                {
                    timeOutmyActivityList.Add(myActivity);
                    
                }
                else
                {
                    myActivityList.Add(myActivity);
                }
               
            }
            var timeOutmyActivityOrderList = timeOutmyActivityList.OrderByDescending(x => x.StartTime).ToList();
            var myActivityOrderList = myActivityList.OrderByDescending(x => x.StartTime).ToList();
            List<MyActivityDto> activityList = myActivityOrderList.ToList();
            activityList.AddRange(timeOutmyActivityOrderList);
            var resultList = activityList.Skip(pageSize * pageIndex).Take(pageSize).ToList();
            myActivityResponse.TotalCount = activityList.Count();
            if (!conditions.PageSize.HasValue)
            {
                conditions.PageSize = 0;
                myActivityResponse.TotalPage = 0;
            }
            else
            {
                int size = Convert.ToInt32(conditions.PageSize);
                myActivityResponse.TotalPage = (myActivityResponse.TotalCount + size - 1) / size;
            }
            myActivityResponse.Results = resultList;
            return myActivityResponse;
        }

        /// <summary>
        /// 创建活动报名列表
        /// </summary>
        /// <param name="activitySignUpDto"></param>
        /// <returns></returns>
        public ActivitySignUpResponse CreateActivitySignUp(ActivitySignUpCreateRequest activitySignUpDto)
        {
            var activitySignUpResponse = new ActivitySignUpResponse();
            if (activitySignUpDto != null)
            {
                User user = UserHelper.CurrentUser;
              
                var activitySignUp = activitySignUpDto.ActivitySignUp;
                var count = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Count(x => x.ActivityID == activitySignUp.ActivityID && x.CreatedBy == user.UserID);
                if (count == 0)
                {
                    activitySignUp.CreatedBy = user.UserID;
                    activitySignUp.SignUpID = Guid.NewGuid();
                    activitySignUp.Created = DateTime.Now;
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Add(activitySignUp);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                    activitySignUpResponse.Id = activitySignUp.SignUpID;
                }
            }
            else
            {
                throw new BadRequestException("[ActivitySignUpManager Method(CreateActivitySignUp): ActivitySignUpCreateRequest is null]未获取到提交的活动信息！");
            }
            return activitySignUpResponse;
        }

        /// <summary>
        /// 更新活动报名列表数据
        /// </summary>
        /// <param name="activitySignUpDto"></param>
        /// <returns></returns>
        public void UpdateActivitySignUp(ActivitySignUpUpdateRequest activitySignUpDto)
        {
            if (activitySignUpDto != null)
            {

                var activitySignUp =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.FirstOrDefault(
                        x => x.ActivityID == activitySignUpDto.ActivitySignUp.ActivityID);
                if (activitySignUp != null)
                {
                    ActivitySignUpDTOToActivitySignUp(activitySignUpDto.ActivitySignUp,
                        activitySignUp);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    throw new BadRequestException(
                   "[ActivitySignUpManager Method(UpdateActivitySignUp): ActivitySignUp is null]未查询到活动信息！");
                }
            }
            else
            {
                throw new BadRequestException(
                    "[ActivitySignUpManager Method(UpdateActivitySignUp): ActivitySignUpUpdateRequest is null]未获取到提交的活动信息！");
            }
        }

        /// <summary>
        /// 根据ID删除活动报名列表对应数据
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        public void DeleteActivitySignUp(Guid id)
        {
            var activitySignUp = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.FirstOrDefault(x => x.SignUpID == id);
            if (activitySignUp != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Remove(activitySignUp);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[ActivitySignUpManager Method(DeleteActivitySignUp): ActivitySignUp is null id=" + id + "]未查询到活动信息！");
            }
        }

        /// <summary>
        /// 根据查询条件查询活动报名列表数据
        /// </summary>
        /// <param name="conditions">多条件</param>
        /// <returns></returns>
        public ActivitySignUpResponse GetAll(ActivitySignUpRequest conditions)
        {
            ActivitySignUpResponse activitySignUpResponse = new ActivitySignUpResponse();
            IQueryable<ActivitySignUp> activitySignUps;
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                activitySignUps =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.OrderByDescending(p => p.Created)
                        .Skip(pageSize*pageIndex)
                        .Take(pageSize);
            }
            else
            {
                activitySignUps =
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.OrderByDescending(p => p.Created);
            }
            var list = activitySignUps.ToList();
            List<ActivitySignUpDTO> dtoList = new List<ActivitySignUpDTO>();
            Utility.CopyList<ActivitySignUp, ActivitySignUpDTO>(list, dtoList);
            activitySignUpResponse.Results = dtoList;
            activitySignUpResponse.TotalCount =
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Count();
            return activitySignUpResponse;

        }

        public ActivitySignUpStatsResponse GetSignupStats(ActivitySignUpRequest conditions)
        {
            ActivitySignUpStatsResponse activitySignUpStatsResponse = new ActivitySignUpStatsResponse();
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            string sql = "select a.ActivityID,a.Topic,a.StartTime,a.EndTime,count(*) as PeopleNumber from(";
            sql += "select a.ActivityID,b.Topic,b.StartTime,b.EndTime  FROM ActivitySignUp as a ";
            sql += "join ActivityPublishApply as b ";
            sql += "on a.ActivityID=b.ActivityID UNION select a.ActivityID,b.Topic,b.StartTime,b.EndTime  FROM ActivitySignUp as a ";
            sql += "join IncubatorActivityApply as b on a.ActivityID=b.ActivityID) as a group by a.ActivityID,a.Topic,a.StartTime,a.EndTime";
            List<SqlParameter> paralist = new List<SqlParameter>();
            IEnumerable<ActivitySignUpStatsDTO> activitySignUpStats = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<ActivitySignUpStatsDTO>(sql, paralist.ToArray()).ToList();
            activitySignUpStats = activitySignUpStats.Where(x => x.Topic.Contains(conditions.SearchString));
            if (activitySignUpStats != null && activitySignUpStats.Count() > 0)
            {
                activitySignUpStatsResponse.TotalCount = activitySignUpStats.Count();
                activitySignUpStatsResponse.TotalPage = (activitySignUpStatsResponse.TotalCount + pageSize - 1) / pageSize;
                activitySignUpStats = activitySignUpStats.Skip(pageSize * pageIndex).Take(pageSize).ToList();
            }
            activitySignUpStatsResponse.Results = activitySignUpStats.ToList(); 
            return activitySignUpStatsResponse;

        }
        public ActivitySignUpResponse GetSignupInformation(ActivitySignUpRequest conditions)
        {
            ActivitySignUpResponse activitySignUpResponse = new ActivitySignUpResponse();
            int pageSize = Convert.ToInt32(conditions.PageSize);
            int pageIndex = Convert.ToInt32(conditions.PageNumber);
            var activitySignUps = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Where(x => x.ActivityID == conditions.ActivityId).OrderByDescending(x => x.Created).ToList();
            activitySignUpResponse.TotalCount = activitySignUps.Count();
            activitySignUpResponse.TotalPage = (activitySignUpResponse.TotalCount + pageSize - 1) / pageSize;
            activitySignUps = activitySignUps.Skip(pageSize * pageIndex).Take(pageSize).ToList();
            List<ActivitySignUpDTO> dtoList = new List<ActivitySignUpDTO>();
            Utility.CopyList<ActivitySignUp, ActivitySignUpDTO>(activitySignUps, dtoList);
            activitySignUpResponse.Results = dtoList;
            return activitySignUpResponse;

        }

        public ExportResponse ExportToExcel(ActivitySignUpRequest conditions)
        {
            ExportResponse exprortResponse = new ExportResponse();
            string filePath = string.Empty;
            string fileUploadFolder = string.Empty;
            string fileName = string.Empty;
            string returnFilePath = string.Empty;
            var activitySignUps = SISPIncubatorOnlinePlatformEntitiesInstance.ActivitySignUp.Where(x => x.ActivityID == conditions.ActivityId).OrderByDescending(x => x.Created).ToList();
            fileName = "singupreport" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xlsx";

            fileUploadFolder = ConfigurationManager.AppSettings["SingUpReportFolder"];

            string folder = HttpContext.Current.Server.MapPath("../" + fileUploadFolder);
            // 判定该路径是否存在
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);
            filePath = folder + "/" + fileName;
            FileInfo fileInfo = new FileInfo(filePath);
            if (fileInfo.Exists)
            {
                fileInfo.Delete();
                fileInfo = new FileInfo(filePath);
            }

            using (ExcelPackage excelPackage = new ExcelPackage())
            {
                ExcelWorksheet excelWorksheet = excelPackage.Workbook.Worksheets.Add("export data");
                excelWorksheet.Cells[1, 1].Value = "姓名";
                excelWorksheet.Cells[1, 2].Value = "公司名称";
                excelWorksheet.Cells[1, 3].Value = "手机号码";
                for (int i = 0; i < activitySignUps.Count; i++)
                {
                    ActivitySignUp record = activitySignUps[i];
                    excelWorksheet.Cells[i + 2, 1].Value = record.SignUpName;
                    excelWorksheet.Cells[i + 2, 2].Value = record.WorkingCompany;
                    excelWorksheet.Cells[i + 2, 3].Value = record.PhoneNumber;
                }
                excelPackage.SaveAs(fileInfo);

                returnFilePath = Utility.GetServicesUrl() + fileUploadFolder + "/" + fileName;
            }
            exprortResponse.FileUrl = returnFilePath;
            return exprortResponse;
        }

        private void ActivitySignUpDTOToActivitySignUp(ActivitySignUp activitySignUpDto, ActivitySignUp activitySignUp)
        {
            activitySignUp.ActivityID = activitySignUpDto.ActivityID;
            activitySignUp.SignUpName = activitySignUpDto.SignUpName;
            activitySignUp.WorkingCompany = activitySignUpDto.WorkingCompany;
            activitySignUp.PhoneNumber = activitySignUpDto.PhoneNumber;
        }
    }
}