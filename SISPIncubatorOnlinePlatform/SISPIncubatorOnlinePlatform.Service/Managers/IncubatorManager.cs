using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using OfficeOpenXml;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Controllers;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;


namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class IncubatorManager : BaseManager
    {
        /// <summary>
        /// 根据条件查询列表
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public List<IncubatorDTO> GetAllByCondition(IncubatorRequest conditions, out int total)
        {
            List<IncubatorInformation> listNew = new List<IncubatorInformation>();
            List<IncubatorInformation> listContainer = new List<IncubatorInformation>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string condition = conditions.KeyWord;
                string userType = conditions.UserType;
                //如果是普通用户，就查询角色。关联其对应的孵化器
                if (!string.IsNullOrEmpty(userType) && userType.Trim() == "common")
                {
                    User user = UserHelper.CurrentUser;
                    foreach (User_Roles role in user.User_Roles)
                    {
                        List<IncubatorInformation> list;
                        if (role.Roles != null)
                        {
                            list =
                                role.Roles.IncubatorInformation.Where(p => p.IncubatorName.Contains(condition) && p.IsDelete == false)
                                    .OrderBy(p => p.Sort).ThenBy(p => p.Created).ThenByDescending(p => p.Sort).ToList();
                            listContainer.AddRange(list);
                        }
                        else
                        {
                            LoggerHelper.Error("[IncubatorManager Method(GetAllByCondition): User_Roles role in user.User_Roles role is null]用户角色不正确！");
                            throw new BadRequestException("[IncubatorManager Method(GetAllByCondition): User_Roles role in user.User_Roles role is null]用户角色不正确！");
                        }
                    }
                    total = listContainer.OrderBy(p => p.Created).ToList().Count;
                    listNew = listContainer.OrderBy(p => p.Sort).ThenBy(p => p.Created).Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorInformation>();
                }
                else
                {
                    listContainer =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
                            p => p.IncubatorName.Contains(condition) && p.IsDelete == false)
                            .OrderBy(p => p.Sort).ThenBy(p => p.Created).ThenByDescending(p => p.Sort)
                            .ToList();
                    total = listContainer.Count;
                    listNew = listContainer.Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorInformation>();
                }
            }
            else
            {
                LoggerHelper.Error("[IncubatorManager Method(GetAllByCondition): IncubatorRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetAllByCondition): IncubatorRequest is null]未能正确获取查询条件！");
            }
            return IncubatorTOIncubatorDTO(listNew);
        }

        /// <summary>
        /// 根据条件查询列表(PC)
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public List<IncubatorDTO> GetPcAllByCondition(IncubatorRequest conditions, out int total)
        {
            List<IncubatorInformation> listNew = new List<IncubatorInformation>();
            List<IncubatorInformation> listContainer = new List<IncubatorInformation>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string condition = conditions.KeyWord;
                string userType = conditions.UserType;
                //如果是普通用户，就查询角色。关联其对应的孵化器
                if (!string.IsNullOrEmpty(userType) && userType.Trim() == "common")
                {
                    User user = UserHelper.CurrentUser;
                    foreach (User_Roles role in user.User_Roles)
                    {
                        List<IncubatorInformation> list;
                        if (role.Roles != null)
                        {
                            list =
                                role.Roles.IncubatorInformation.Where(p => p.IncubatorName.Contains(condition) && p.IsDelete == false)
                                    .OrderBy(p => p.Created).ToList();
                            listContainer.AddRange(list);
                        }
                        else
                        {
                            LoggerHelper.Error("[IncubatorManager Method(GetAllByCondition): User_Roles role in user.User_Roles role is null]用户角色不正确！");
                            throw new BadRequestException("[IncubatorManager Method(GetAllByCondition): User_Roles role in user.User_Roles role is null]用户角色不正确！");
                        }
                    }
                    total = listContainer.Count;
                    listNew = listContainer.OrderBy(p => p.Created).ThenByDescending(p => p.Sort).Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorInformation>();
                }
                else if (!string.IsNullOrEmpty(userType) && userType.Trim() == "admin")
                {
                    listContainer =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
                            p => p.IncubatorName.Contains(condition))
                            .OrderBy(p => p.Sort)
                            .ThenBy(p => p.Created)
                            .ThenBy(p => p.IncubatorName)
                            .ThenByDescending(p => p.Sort)
                            .ToList();
                    listNew =listContainer.Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorInformation>();
                    total = listContainer.Count;
                }
                else if (!string.IsNullOrEmpty(userType) && userType.Trim() == "home")
                {

                    listContainer = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
                        p => p.IncubatorName.Contains(condition) && p.IsShow == true && p.IsDelete == false)
                        .OrderBy(p => p.Sort)
                        .ThenBy(p => p.Created)
                        .ThenBy(p => p.IncubatorName).ThenByDescending(p => p.Sort).ToList();
                    listNew =

                            listContainer.Skip(pageSize * pageIndex)
                            .Take(pageSize)
                            .ToList<IncubatorInformation>();
                    total = listContainer.Count;
                }
                else
                {

                    listContainer = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
                        p => p.IncubatorName.Contains(condition) && p.IsDelete == false)
                        .OrderBy(p => p.Sort)
                        .ThenBy(p => p.Created)
                        .ThenBy(p => p.IncubatorName).ThenByDescending(p => p.Sort).ToList();
                     listNew =
                       listContainer
                            .Skip(pageSize * pageIndex)
                            .Take(pageSize)
                            .ToList<IncubatorInformation>();
                     total = listContainer.Count;
                }
            }
            else
            {
                LoggerHelper.Error("[IncubatorManager Method(GetAllByCondition): IncubatorRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetAllByCondition): IncubatorRequest is null]未能正确获取查询条件！");
            }
            return IncubatorTOIncubatorDTO(listNew);
        }

        /// <summary>
        /// 根据条件项目统计
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public List<IncubatorProjectReportDTO> GetIncubatorProjectReportByCondition(IncubatorRequest conditions, out int total)
        {
            List<IncubatorInformation> listNew = new List<IncubatorInformation>();
            List<IncubatorProjectReportDTO> listIncubatorProjectReportDtos = new List<IncubatorProjectReportDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string condition = conditions.KeyWord;

                List<IncubatorInformation> listTemp = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
                        p => p.IncubatorName.Contains(condition) && p.IsShow == true)
                        .OrderBy(p => p.Created)
                        .ThenBy(p => p.Sort)
                        .ThenBy(p => p.IncubatorName)
                        .ToList<IncubatorInformation>();
                total = listTemp.Count;

                listNew = listTemp.Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorInformation>();

                foreach (IncubatorInformation incubatorInformation in listNew)
                {
                    IncubatorProjectReportDTO incubatorProjectReportDto = new IncubatorProjectReportDTO();

                    Guid inGuid = incubatorInformation.IncubatorID;

                    incubatorProjectReportDto.IncubatorID = inGuid;
                    incubatorProjectReportDto.IncubatorName = incubatorInformation.IncubatorName;
                    incubatorProjectReportDto.IncubatorDes = incubatorInformation.Description;


                    //已注册
                    string code1 = SISPIncubatorOnlineEnum.ProjectType.Registered.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectRegisteredCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code1).ToList().Count;
                    //孵化中
                    string code2 = SISPIncubatorOnlineEnum.ProjectType.Hatching.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectHatchingCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code2).ToList().Count;
                    //孵化完成
                    string code3 = SISPIncubatorOnlineEnum.ProjectType.Incubatored.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectIncubatoredCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code3).ToList().Count;
                    //寻找融资
                    string code4 = SISPIncubatorOnlineEnum.ProjectType.SeekFinancing.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectSeekFinancingCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code4).ToList().Count;
                    listIncubatorProjectReportDtos.Add(incubatorProjectReportDto);
                }
            }
            else
            {
                LoggerHelper.Error("[IncubatorManager Method(GetIncubatorProjectReportByCondition): conditions is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetIncubatorProjectReportByCondition): conditions is null]未能正确获取查询条件！");
            }
            return listIncubatorProjectReportDtos;
        }

        /// <summary>
        /// 获取所有孵化器
        /// </summary>
        /// <returns></returns>
        public List<IncubatorInformation> GetAll()
        {
            var incubatores =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.OrderBy(p => p.Created)
                        .ToList<IncubatorInformation>();

            return incubatores;
        }

        /// <summary>
        /// 新增一条孵化器记录
        /// </summary>
        /// <param name="incubatorInfoRequest"></param>
        /// <param name="isExist"></param>
        /// <returns></returns>
        public void Add(IncubatorInfoRequest incubatorInfoRequest)
        {
            IncubatorInformation imInformation = new IncubatorInformation();
            if (incubatorInfoRequest.IncubatorInformation != null)
            {
                imInformation = incubatorInfoRequest.IncubatorInformation;

                var incubator =
     SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
         p => p.IncubatorName.Contains(imInformation.IncubatorName));
                if (incubator.FirstOrDefault() != null)
                {
                    LoggerHelper.Error("[IncubatorManager Method(Add):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]该孵化器已存在！");
                    throw new BadRequestException("[IncubatorManager Method(Add):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]该孵化器已存在！");
                }


                User user = UserHelper.CurrentUser;
                imInformation.CreatedBy = user.UserID;
                imInformation.IncubatorID = Guid.NewGuid();
                imInformation.Created = DateTime.Now;

                //imInformation.RoleID = new Guid("7FA365FA-240B-47AA-B7E5-C81A1FE11256");
                imInformation.IsDelete = false;

                imInformation.Logo = imInformation.Logo.Replace(Utility.GetServicesImageUrl(), "");

                string companyLogoPath = HttpContext.Current.Server.MapPath(imInformation.Logo);
                //重新生成三个图片
                ImageHelper.GetReducedImage(companyLogoPath);

                ImageHelper.GetRoundnessImage(companyLogoPath);

                foreach (IncubatorProjects incubatorProjects in imInformation.IncubatorProjects)
                {
                    string projectType = incubatorProjects.ProjectType;
                    incubatorProjects.ProjectID = Guid.NewGuid();
                    incubatorProjects.ProjectPicture = incubatorProjects.ProjectPicture.Replace(Utility.GetServicesImageUrl(), "");

                    if (projectType == "0")
                    {
                        incubatorProjects.ProjectType =
                            SISPIncubatorOnlineEnum.ProjectType.Registered.GetHashCode().ToString();
                    }
                    else if (projectType == "1")
                    {
                        incubatorProjects.ProjectType =
                            SISPIncubatorOnlineEnum.ProjectType.Hatching.GetHashCode().ToString();
                    }
                    else if (projectType == "2")
                    {
                        incubatorProjects.ProjectType =
                            SISPIncubatorOnlineEnum.ProjectType.Incubatored.GetHashCode().ToString();
                    }
                    else if (projectType == "3")
                    {
                        incubatorProjects.ProjectType =
                            SISPIncubatorOnlineEnum.ProjectType.SeekFinancing.GetHashCode().ToString();
                    }

                    string projectLogoPath = HttpContext.Current.Server.MapPath(incubatorProjects.ProjectPicture);
                    ImageHelper.GetReducedImage(projectLogoPath);
                }

                //缺少添加人
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Add(imInformation);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    LoggerHelper.Error("[IncubatorManager Method(Add):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确提交孵化器数据！");
                    throw new BadRequestException("[IncubatorManager Method(Add):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确提交孵化器数据！");
                }
            }
            else
            {
                LoggerHelper.Error("[IncubatorManager Method(Add): incubatorInfoRequest.IncubatorInformation is null ]未能正确提交孵化器数据！");
                throw new BadRequestException("[IncubatorManager Method(Add): incubatorInfoRequest.IncubatorInformation is null ]未能正确提交孵化器数据！");
            }
        }

        /// <summary>
        /// 更新一条孵化器记录
        /// </summary>
        /// <param name="incubatorInfoRequest"></param>
        /// <param name="isExist"></param>
        /// <returns></returns>
        public void Update(IncubatorInfoRequest incubatorInfoRequest)
        {
            if (incubatorInfoRequest.IncubatorInformation != null)
            {
                IncubatorInformation imInformationNew = incubatorInfoRequest.IncubatorInformation;

                var incubator = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorName.Contains(imInformationNew.IncubatorName));
                if (incubator != null && incubator.IncubatorID != imInformationNew.IncubatorID)
                {
                    throw new BadRequestException("[IncubatorManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]孵化器名称重复！");
                }
                IncubatorInformation imInformation =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorID == imInformationNew.IncubatorID);
                string filePath = "";
                if (imInformation != null)
                {

                    foreach (IncubatorProjects incubatorProjects in imInformation.IncubatorProjects)
                    {
                        filePath = filePath + "," + incubatorProjects.ProjectPicture;
                    }

                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.RemoveRange(
                        imInformation.IncubatorProjects);
                    string oldLogoPath = imInformation.Logo;
                    imInformation = IncubatorDtoTOIncubator(imInformationNew, imInformation);

                    WeiXinRequest weiXinRequest = incubatorInfoRequest.WeiXinRequest;
                    foreach (IncubatorProjects projects in imInformationNew.IncubatorProjects)
                    {
                        projects.ProjectID = Guid.NewGuid();
                        projects.IncubatorID = imInformation.IncubatorID;
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Add(projects);
                    }
                    if (weiXinRequest != null)
                    {
                        string fileUploadFolder = ConfigurationManager.AppSettings[weiXinRequest.SavePath];
                        if (!string.IsNullOrEmpty(weiXinRequest.MediaID))
                        {
                            filePath = filePath + "," + oldLogoPath;

                            imInformation.Logo = fileUploadFolder + "\\" + weiXinRequest.FileName + ".jpg";
                        }
                    }

                    foreach (IncubatorProjectsDTO incubatorProjectsDto in incubatorInfoRequest.IncubatorProjectsDtos)
                    {
                        string fileProjectUploadFolder = ConfigurationManager.AppSettings[incubatorProjectsDto.SavePath];
                        IncubatorProjects incubatorProjects = new IncubatorProjects();
                        incubatorProjects.Description = incubatorProjectsDto.Description;
                        incubatorProjects.IncubatorID = imInformation.IncubatorID;
                        incubatorProjects.ProjectID = Guid.NewGuid();
                        incubatorProjects.ProjectPicture =
                            incubatorProjectsDto.ProjectPicture.Replace(Utility.GetServicesImageUrl(), "");

                        incubatorProjects.ProjectType = incubatorProjectsDto.ProjectType;
                        string projectType = incubatorProjectsDto.ProjectType;
                        if (projectType == "0")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.Registered.GetHashCode().ToString();
                        }
                        else if (projectType == "1")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.Hatching.GetHashCode().ToString();
                        }
                        else if (projectType == "2")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.Incubatored.GetHashCode().ToString();
                        }
                        else if (projectType == "3")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.SeekFinancing.GetHashCode().ToString();
                        }


                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Add(incubatorProjects);
                        if (weiXinRequest != null && !string.IsNullOrEmpty(incubatorProjectsDto.MediaID))
                        {
                            incubatorProjects.ProjectPicture = fileProjectUploadFolder + "\\" +
                                                               incubatorProjectsDto.FileName + ".jpg";

                            weiXinRequest.MediaID = weiXinRequest.MediaID + "," + incubatorProjectsDto.MediaID;
                            weiXinRequest.FileName = weiXinRequest.FileName + "," + incubatorProjectsDto.FileName;
                            weiXinRequest.SavePath = weiXinRequest.SavePath + "," + incubatorProjectsDto.SavePath;
                        }

                    }

                    WeiXinManager weiXinManager = new WeiXinManager();
                    weiXinManager.GetMultimedia(weiXinRequest);
                    //截取园
                    string logoPath = HttpContext.Current.Server.MapPath(imInformation.Logo);
                    ImageHelper.GetRoundnessImage(logoPath);
                    //删除物理文件
                    //Utility.DeleteFileByPath(filePath);

                    if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                    {
                        throw new BadRequestException(
                            "[IncubatorManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确更新孵化器数据！");
                    }
                }
                else
                {
                    throw new BadRequestException("[IncubatorManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorID == imInformationNew.IncubatorID) is null ]未能正确更新孵化器数据！");
                }
            }
            else
            {
                throw new BadRequestException("[IncubatorManager Method(Update): incubatorInfoRequest.IncubatorInformation is null ]未能正确更新孵化器数据！");
            }
        }

        /// <summary>
        /// 更新一条孵化器记录pc
        /// </summary>
        /// <param name="incubatorInfoRequest"></param>
        /// <param name="isExist"></param>
        /// <returns></returns>
        public void UpdateOfPc(IncubatorInfoRequest incubatorInfoRequest)
        {
            if (incubatorInfoRequest.IncubatorInformation != null)
            {
                IncubatorInformation imInformationNew = incubatorInfoRequest.IncubatorInformation;

                var incubator = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorName.Contains(imInformationNew.IncubatorName));
                if (incubator != null && incubator.IncubatorID != imInformationNew.IncubatorID)
                {
                    throw new BadRequestException("[IncubatorManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]孵化器名称重复！");
                }
                IncubatorInformation imInformation =
                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorID == imInformationNew.IncubatorID);
                string filePath = "";
                if (imInformation != null)
                {
                    string fileCompanyOldPath = imInformation.Logo;
                    foreach (IncubatorProjects incubatorProjects in imInformation.IncubatorProjects)
                    {
                        foreach (IncubatorProjectsDTO incubatorProjectsDto in incubatorInfoRequest.IncubatorProjectsDtos
                            )
                        {
                            string oldProjectPath = incubatorProjects.ProjectPicture;
                            string newProjectPath = incubatorProjectsDto.ProjectPicture.Replace(Utility.GetServicesImageUrl(), "");
                            if (oldProjectPath != newProjectPath)
                            {
                                filePath = filePath + "," + oldProjectPath;
                            }
                        }

                    }


                    SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.RemoveRange(
                        imInformation.IncubatorProjects);
                    imInformation = IncubatorDtoTOIncubator(imInformationNew, imInformation);
                    if (imInformation.Logo != fileCompanyOldPath)
                    {
                        string companyLogoPath = HttpContext.Current.Server.MapPath("../" + imInformation.Logo);
                        //重新生成三个图片
                        ImageHelper.GetReducedImage(companyLogoPath);

                        ImageHelper.GetRoundnessImage(companyLogoPath);

                        filePath = filePath + "," + fileCompanyOldPath;
                    }

                    foreach (IncubatorProjectsDTO incubatorProjectsDto in incubatorInfoRequest.IncubatorProjectsDtos)
                    {
                        string fileProjectUploadFolder = ConfigurationManager.AppSettings[incubatorProjectsDto.SavePath];
                        IncubatorProjects incubatorProjects = new IncubatorProjects();
                        incubatorProjects.Description = incubatorProjectsDto.Description;
                        incubatorProjects.IncubatorID = imInformation.IncubatorID;
                        incubatorProjects.ProjectID = Guid.NewGuid();
                        incubatorProjects.ProjectPicture =
                            incubatorProjectsDto.ProjectPicture.Replace(Utility.GetServicesImageUrl(), "");
                        incubatorProjects.ProjectType = incubatorProjectsDto.ProjectType;
                        string projectType = incubatorProjectsDto.ProjectType;
                        if (projectType == "0")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.Registered.GetHashCode().ToString();
                        }
                        else if (projectType == "1")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.Hatching.GetHashCode().ToString();
                        }
                        else if (projectType == "2")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.Incubatored.GetHashCode().ToString();
                        }
                        else if (projectType == "3")
                        {
                            incubatorProjects.ProjectType =
                                SISPIncubatorOnlineEnum.ProjectType.SeekFinancing.GetHashCode().ToString();
                        }

                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Add(incubatorProjects);
                        string projectLogoPath = HttpContext.Current.Server.MapPath("../" + incubatorProjects.ProjectPicture);
                        ImageHelper.GetReducedImage(projectLogoPath);
                    }
                    //删除物理文件
                    //Utility.DeleteFileByPath(filePath);

                    if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                    {
                        throw new BadRequestException(
                            "[IncubatorManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确更新孵化器数据！");
                    }
                }
                else
                {
                    throw new BadRequestException("[IncubatorManager Method(Update): SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorID == imInformationNew.IncubatorID) is null ]未能正确更新孵化器数据！");
                }
            }
            else
            {
                throw new BadRequestException("[IncubatorManager Method(Update): incubatorInfoRequest.IncubatorInformation is null ]未能正确更新孵化器数据！");
            }
        }
        /// <summary>
        /// 逻辑删除孵化器状态
        /// </summary>
        /// <param name="incubatorInfoDeleteRequest"></param>
        public void DeleteIncubators(IncubatorInfoDeleteRequest incubatorInfoDeleteRequest)
        {
            if (incubatorInfoDeleteRequest != null)
            {
                string ids = incubatorInfoDeleteRequest.Ids;
                string[] idArray = ids.Split('|');
                foreach (string s in idArray)
                {
                    if (!string.IsNullOrEmpty(s))
                    {
                        IncubatorInformation incubatorInformation = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(
                              p => p.IncubatorID == new Guid(s));
                        if (incubatorInformation != null)
                        {
                            incubatorInformation.IsDelete = true;
                            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                        }

                    }
                }
            }
            else
            {
                throw new BadRequestException("[IncubatorManager Method(Update): incubatorInfoDeleteRequest is null ]incubatorInfoDeleteRequest api 配置错误！");
            }
        }
        /// <summary>
        /// 删除一条记录
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void Delete(Guid id)
        {
            IncubatorInformation imInformation =
                SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorID == id);
            SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Remove(imInformation);
            if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
            {
                throw new BadRequestException("[IncubatorManager Method(delete):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail ]未能正确删除孵化器数据！");
            }
        }

        /// <summary>
        /// 获取孵化器详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<IncubatorDTO> Get(Guid id)
        {
            var imInformation = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(p => p.IncubatorID == id);

            return IncubatorTOIncubatorDTO(imInformation.ToList());
        }

        /// <summary>
        /// 获取孵化器详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IncubatorInformation GetInfo(Guid id)
        {
            return SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.FirstOrDefault(p => p.IncubatorID == id);
        }

        private IncubatorInformation IncubatorDtoTOIncubator(IncubatorInformation incubatorDTO, IncubatorInformation incubator)
        {
            incubator.IncubatorName = incubatorDTO.IncubatorName;
            incubator.OperationAddress = incubatorDTO.OperationAddress;
            incubator.RegTime = incubatorDTO.RegTime;
            incubator.Logo = incubatorDTO.Logo.Replace(Utility.GetServicesImageUrl(), "");
            incubator.FinancialSupport = incubatorDTO.FinancialSupport;
            incubator.Description = incubatorDTO.Description;
            incubator.Service = incubatorDTO.Service;
            incubator.SiteFavorable = incubatorDTO.SiteFavorable;
            incubator.OtherService = incubatorDTO.OtherService;
            //incubator.RegisteredProject = incubatorDTO.RegisteredProject;
            //incubator.IncubationProject = incubatorDTO.IncubationProject;
            //incubator.CompleteProject = incubatorDTO.CompleteProject;
            //incubator.SearchFinanceProject = incubatorDTO.SearchFinanceProject;
            incubator.IndustryRequirement = incubatorDTO.IndustryRequirement;
            incubator.LocationRequirement = incubatorDTO.LocationRequirement;
            incubator.OtherRequirement = incubatorDTO.OtherRequirement;

            incubator.RoleID = incubatorDTO.RoleID;


            if (incubatorDTO.IsShow != null)
            {
                incubator.IsShow = incubatorDTO.IsShow;
            }
            if (incubatorDTO.Sort != null)
            {
                incubator.Sort = incubatorDTO.Sort;
            }

            //incubator.RoleID = incubatorDTO.RoleID;
            //incubator.CreatedBy = incubatorDTO.CreatedBy;
            return incubator;
        }

        private List<IncubatorDTO> IncubatorTOIncubatorDTO(List<IncubatorInformation> incubatorInformations)
        {
            List<IncubatorDTO> listDto = new List<IncubatorDTO>();

            List<IncubatorProjectsDTO> licIncubatorProjectsDtos = null;

            foreach (IncubatorInformation incubatorInformation in incubatorInformations)
            {
                IncubatorDTO incubatorDto = new IncubatorDTO();
                incubatorDto.IncubatorID = incubatorInformation.IncubatorID;
                incubatorDto.IncubatorName = incubatorInformation.IncubatorName;
                incubatorDto.OperationAddress = incubatorInformation.OperationAddress;
                incubatorDto.RegTime = incubatorInformation.RegTime.ToString("yyyy-MM-dd");
                incubatorDto.Logo = Utility.GetServicesImageUrl() + incubatorInformation.Logo;
                incubatorDto.FinancialSupport = incubatorInformation.FinancialSupport;
                incubatorDto.Description = incubatorInformation.Description;
                incubatorDto.Service = incubatorInformation.Service;
                incubatorDto.SiteFavorable = incubatorInformation.SiteFavorable;
                incubatorDto.OtherService = incubatorInformation.OtherService.Length > 0 ? incubatorInformation.OtherService.Substring(1) : "";
                incubatorDto.IndustryRequirement = incubatorInformation.IndustryRequirement;
                incubatorDto.LocationRequirement = incubatorInformation.LocationRequirement;
                incubatorDto.OtherRequirement = incubatorInformation.OtherRequirement;
                incubatorDto.RoleID = incubatorInformation.RoleID;
                incubatorDto.CreatedBy = incubatorInformation.CreatedBy;
                incubatorDto.Created = incubatorInformation.Created;
                incubatorDto.Sort = incubatorInformation.Sort;
                incubatorDto.IsShow = incubatorInformation.IsShow;
                incubatorDto.IsDelete = incubatorInformation.IsDelete;

                licIncubatorProjectsDtos = new List<IncubatorProjectsDTO>();

                foreach (IncubatorProjects incubationProject in incubatorInformation.IncubatorProjects)
                {
                    IncubatorProjectsDTO incubatorProjectsDto = new IncubatorProjectsDTO();
                    incubatorProjectsDto.IncubatorID = incubationProject.IncubatorID;
                    incubatorProjectsDto.ProjectID = incubationProject.ProjectID;
                    incubatorProjectsDto.Description = incubationProject.Description;
                    incubatorProjectsDto.ProjectTypeDes = GetEnumDes(incubationProject.ProjectType);
                    incubatorProjectsDto.ProjectType = incubationProject.ProjectType;
                    incubatorProjectsDto.ProjectPicture = Utility.GetServicesImageUrl() + incubationProject.ProjectPicture;
                    licIncubatorProjectsDtos.Add(incubatorProjectsDto);
                }
                incubatorDto.IncubatorProjects = licIncubatorProjectsDtos;

                AgreementTemplate agreementTemplate =
                    SISPIncubatorOnlinePlatformEntitiesInstance.AgreementTemplate.FirstOrDefault(
                        p => p.IncubatorID == incubatorInformation.IncubatorID);
                if (agreementTemplate != null)
                {
                    AgreementTemplateDTO agreementTemplateDto = new AgreementTemplateDTO();
                    agreementTemplateDto.AttachmentID = agreementTemplate.AttachmentID;
                    agreementTemplateDto.Created = agreementTemplate.Created;
                    agreementTemplateDto.CreatedBy = agreementTemplate.CreatedBy;
                    agreementTemplateDto.FileUrl = Utility.GetServicesUrl() + agreementTemplate.FileUrl;
                    agreementTemplateDto.IncubatorID = agreementTemplate.IncubatorID;
                    agreementTemplateDto.FileName = agreementTemplate.FileName;
                    incubatorDto.AgreementTemplateDto = agreementTemplateDto;
                }

                listDto.Add(incubatorDto);
            }
            return listDto;
        }
        /// <summary>
        /// 先导出到本地，返回URL
        /// </summary>
        /// <param name="conditions"></param>
        /// <param name="total"></param>
        /// <returns></returns>
        public string ExportProjectToExcel(IncubatorRequest conditions, out int total)
        {
            string filePath = string.Empty;
            string fileUploadFolder = string.Empty;
            string fileName = string.Empty;
            string returnFilePath = string.Empty;
            List<IncubatorInformation> listNew = new List<IncubatorInformation>();
            List<IncubatorProjectReportDTO> listIncubatorProjectReportDtos = new List<IncubatorProjectReportDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string condition = conditions.KeyWord;

                List<IncubatorInformation> listTemp = SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorInformation.Where(
                        p => p.IncubatorName.Contains(condition) && p.IsShow == true)
                        .OrderBy(p => p.Created)
                        .ThenBy(p => p.Sort)
                        .ThenBy(p => p.IncubatorName)
                        .ToList<IncubatorInformation>();
                total = listTemp.Count;

                listNew = listTemp.Skip(pageSize * pageIndex).Take(pageSize).ToList<IncubatorInformation>();

                foreach (IncubatorInformation incubatorInformation in listNew)
                {
                    IncubatorProjectReportDTO incubatorProjectReportDto = new IncubatorProjectReportDTO();

                    Guid inGuid = incubatorInformation.IncubatorID;

                    incubatorProjectReportDto.IncubatorID = inGuid;
                    incubatorProjectReportDto.IncubatorName = incubatorInformation.IncubatorName;
                    incubatorProjectReportDto.IncubatorDes = incubatorInformation.Description;


                    //已注册
                    string code1 = SISPIncubatorOnlineEnum.ProjectType.Registered.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectRegisteredCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code1).ToList().Count;
                    //孵化中
                    string code2 = SISPIncubatorOnlineEnum.ProjectType.Hatching.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectHatchingCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code2).ToList().Count;
                    //孵化完成
                    string code3 = SISPIncubatorOnlineEnum.ProjectType.Incubatored.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectIncubatoredCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code3).ToList().Count;
                    //寻找融资
                    string code4 = SISPIncubatorOnlineEnum.ProjectType.SeekFinancing.GetHashCode().ToString();
                    incubatorProjectReportDto.ProjectSeekFinancingCount =
                        SISPIncubatorOnlinePlatformEntitiesInstance.IncubatorProjects.Where(
                            p => p.IncubatorID == inGuid && p.ProjectType == code4).ToList().Count;
                    listIncubatorProjectReportDtos.Add(incubatorProjectReportDto);
                }

                fileName = "projectreport"+DateTime.Now.ToString("yyyyMMddHHmmss") + ".xlsx";

                fileUploadFolder = ConfigurationManager.AppSettings["ProjectReportFolder"];

                string folder = HttpContext.Current.Server.MapPath("../"+fileUploadFolder);
                // 判定该路径是否存在
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                filePath = folder+"/" + fileName;
                FileInfo fileInfo = new FileInfo(filePath);
                if (fileInfo.Exists)
                {
                    fileInfo.Delete();
                    fileInfo = new FileInfo(filePath);
                }

                using (ExcelPackage excelPackage = new ExcelPackage())
                {
                    ExcelWorksheet excelWorksheet = excelPackage.Workbook.Worksheets.Add("export data");
                    excelWorksheet.Cells[1, 1].Value = "名称";
                    excelWorksheet.Cells[1, 2].Value = "描述";
                    excelWorksheet.Cells[1, 3].Value = "已注册";
                    excelWorksheet.Cells[1, 4].Value = "孵化中";
                    excelWorksheet.Cells[1, 5].Value = "孵化完成";
                    excelWorksheet.Cells[1, 6].Value = "寻求融资";

                    for (int i = 0; i < listIncubatorProjectReportDtos.Count; i++)
                    {
                        IncubatorProjectReportDTO record = listIncubatorProjectReportDtos[i];
                        excelWorksheet.Cells[i + 2, 1].Value = record.IncubatorName;
                        excelWorksheet.Cells[i + 2, 2].Value = record.IncubatorDes;
                        excelWorksheet.Cells[i + 2, 3].Value = record.ProjectRegisteredCount;
                        excelWorksheet.Cells[i + 2, 4].Value = record.ProjectHatchingCount;
                        excelWorksheet.Cells[i + 2, 5].Value = record.ProjectIncubatoredCount;
                        excelWorksheet.Cells[i + 2, 6].Value = record.ProjectSeekFinancingCount;
                    }
                    excelPackage.SaveAs(fileInfo);

                    returnFilePath =Utility.GetServicesUrl()+ fileUploadFolder + "/" + fileName;
                }

            }
            else
            {
                LoggerHelper.Error("[IncubatorManager Method(GetIncubatorProjectReportByCondition): conditions is null]未能正确获取查询条件！");
                throw new BadRequestException("[IncubatorManager Method(GetIncubatorProjectReportByCondition): conditions is null]未能正确获取查询条件！");
            }
            return returnFilePath;
        }

        private string GetEnumDes(string code)
        {
            var approveIncubatorStatus =
                from SISPIncubatorOnlineEnum.ProjectType e in Enum.GetValues(typeof(SISPIncubatorOnlineEnum.ProjectType))
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

    }
}