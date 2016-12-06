using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class AdvertisementManager : BaseManager
    {
        /// <summary>
        /// 创建广告信息
        /// </summary>
        /// <param name="advertisementCreateRequest"></param>
        /// <returns></returns>
        public Guid CreateAdvertisement(AdvertisementCreateRequest advertisementCreateRequest)
        {
            Advertisement advertisement = advertisementCreateRequest.Advertisement;
            if (advertisement != null && advertisement.CreatedBy != null && !string.IsNullOrEmpty(Convert.ToString(advertisement.CreatedBy)))
            {
                User user = UserHelper.CurrentUser;
                advertisement.CreatedBy = user.UserID;
                advertisement.Created = DateTime.Now;
                advertisement.IsShow = true;
                SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.Add(advertisement);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[AdvertisementManager Method(CreateAdvertisement): AdvertisementCreateRequest is null]未获取到提交的广告信息！");
            }
            return advertisement.AdID;
        }
        /// <summary>
        /// 创建广告信息
        /// </summary>
        public void CreateAdvertisement()
        {
            User user = UserHelper.CurrentUser;
            string id = System.Web.HttpContext.Current.Request.Params["IncubatorApplyId"];
            string description = System.Web.HttpContext.Current.Request.Params["AdDescription"] == null ? "" : Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["AdDescription"]);
            string url = System.Web.HttpContext.Current.Request.Params["AdInternertUrl"] == null ? "" : Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["AdInternertUrl"]);
            string sort = System.Web.HttpContext.Current.Request.Params["AdSort"] == null ? "" : Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["AdSort"]);
            string isShow = System.Web.HttpContext.Current.Request.Params["AdIsShow"] == null ? "" : Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["AdIsShow"]);
            string module = System.Web.HttpContext.Current.Request.Params["AdModule"] == null ? "" : Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["AdModule"]);
            string isEffective = System.Web.HttpContext.Current.Request.Params["AdIsEffective"] == null ? "" : Utility.UnicodeToString(System.Web.HttpContext.Current.Request.Params["AdIsEffective"]);
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string filePath = "";
            Advertisement advertisement = null;
            bool isUpload = false;
            if (hfc.Count > 0)
            {
                //新增附件
                for (int i = 0; i < hfc.Count; i++)
                {
                    if (hfc[i].ContentLength <= 0)
                    {
                        isUpload = true;
                        break;
                    }
                    string fileUploadFolder = ConfigurationManager.AppSettings["AdvertisementFolder"];
                    string physicalPath = HttpContext.Current.Server.MapPath(fileUploadFolder);
                    string fileName = Path.GetFileName(hfc[i].FileName);
                    string fileExtension = Path.GetExtension(hfc[i].FileName).ToLower();
                    if (!Directory.Exists(physicalPath))
                    {
                        Directory.CreateDirectory(physicalPath);
                    }
                    string fname = fileName.Split('.')[0] + DateTime.Now.ToString("yyyyMMddHHss") + fileExtension;
                    filePath = fileUploadFolder + "/" + fname;
                    string savepath = physicalPath + "/" + fname;
                    hfc[i].SaveAs(savepath);
                    isUpload = true;
                }
            }
            if (isUpload)
            {
                //新增
                if (string.IsNullOrEmpty(id))
                {
                    advertisement = new Advertisement();
                    advertisement.AdID = Guid.NewGuid();
                    advertisement.Description = description;
                    advertisement.Sort = Convert.ToInt32(sort);
                    advertisement.IsShow = (isShow == "true");
                    advertisement.Hits = 0;
                    advertisement.Url = url;
                    advertisement.Picture = filePath;
                    advertisement.Module = module;
                    advertisement.Status = (isEffective == "true"
                        ? SISPIncubatorOnlineEnum.FieldStatus.Effect.GetHashCode().ToString()
                        : SISPIncubatorOnlineEnum.FieldStatus.Fail.GetHashCode().ToString());
                    advertisement.Created = DateTime.Now;
                    advertisement.CreatedBy = user.UserID;
                    SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.Add(advertisement);
                }
                //修改
                else
                {
                    advertisement =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.FirstOrDefault(
                            p => p.AdID == new Guid(id));
                    if (advertisement != null)
                    {
                        advertisement.Description = description;
                        advertisement.Sort = Convert.ToInt32(sort);
                        advertisement.IsShow = (isShow == "true");
                        advertisement.Hits = 0;
                        advertisement.Url = url;
                        if (!string.IsNullOrEmpty(filePath))
                        {
                            advertisement.Picture = filePath;
                        }
                        advertisement.Module = module;
                        advertisement.Status = (isEffective == "true"
             ? SISPIncubatorOnlineEnum.FieldStatus.Effect.GetHashCode().ToString()
             : SISPIncubatorOnlineEnum.FieldStatus.Fail.GetHashCode().ToString());
                        advertisement.Created = DateTime.Now;
                        advertisement.CreatedBy = user.UserID;

                    }
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                LoggerHelper.Error("[AdvertisementManager Method(CreateAdvertisement): upload file is fail]上传图片失败！");
                throw new BadRequestException("[AdvertisementManager Method(CreateAdvertisement): AdvertisementRequest is null]上传图片失败！");
            }
        }

        /// <summary>
        /// 根据主键获取广告信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<AdvertisementDTO> GetAdvertisementById(Guid id)
        {
            Advertisement advertisement =
                SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.FirstOrDefault(p => p.AdID == id);
            AdvertisementDTO advertisementDto = new AdvertisementDTO();

            AddTraffic(id);

            GetModelDTO(advertisement, advertisementDto);
            List<AdvertisementDTO> list = new List<AdvertisementDTO>();
            list.Add(advertisementDto);
            return list;
        }

        /// <summary>
        /// 根据查询条件获取所有广告信息
        /// </summary>
        /// <returns></returns>
        public List<AdvertisementDTO> GetAll(AdvertisementRequest conditions, out int total)
        {
            List<Advertisement> list = new List<Advertisement>();
            List<AdvertisementDTO> listAdvertisementDtos = new List<AdvertisementDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);
                string status = SISPIncubatorOnlineEnum.FieldStatus.Effect.GetHashCode().ToString();
                string type = conditions.Type;
                if (!string.IsNullOrEmpty(type) && type == "admin")
                {
                    List<Advertisement> listTmp =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.OrderBy(p => p.Created).ToList();

                    total = listTmp.Count;
                    list = listTmp.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<Advertisement>();
                }
                else if (!string.IsNullOrEmpty(type))
                {
                    string keyWord = "首页";
                    if (type == "home")
                    {
                        keyWord = "首页";
                    }
                    else if (type == "investment")
                    {
                        keyWord = "投资机构";
                    }
                    else if (type == "cooperation")
                    {
                        keyWord = "业务合作";
                    }
                    else if (type == "financing")
                    {
                        keyWord = "融资项目";
                    }
                    List<Advertisement> listTmp =
                        SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.Where(p => p.Module.Contains(keyWord) && p.IsShow == true && p.Status == status).OrderBy(p => p.Sort).ThenByDescending(p => p.Created).ToList();
                    total = listTmp.Count;
                    list = listTmp.Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<Advertisement>();
                }
                else
                {
                    total = 0;
                }
                foreach (Advertisement advertisement in list)
                {
                    AdvertisementDTO advertisementDto = new AdvertisementDTO();
                    GetModelDTO(advertisement, advertisementDto);
                    listAdvertisementDtos.Add(advertisementDto);
                }
            }
            else
            {
                LoggerHelper.Error("[AdvertisementManager Method(GetAll): AdvertisementRequest is null]未能正确获取查询条件！");
                throw new BadRequestException("[AdvertisementManager Method(GetAll): AdvertisementRequest is null]未能正确获取查询条件！");
            }
            return listAdvertisementDtos;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="advertisementCreateRequest"></param>
        /// <returns></returns>
        public void UpdateAdvertisement(AdvertisementCreateRequest advertisementCreateRequest)
        {
            if (advertisementCreateRequest.Advertisement == null)
            {
                throw new BadRequestException("[AdvertisementManager Method(UpdateAdvertisement): Advertisement is null]未获取到要更新的对象！");
            }
            Advertisement updatemodel = advertisementCreateRequest.Advertisement;
            Advertisement model = SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.FirstOrDefault(m => m.AdID == updatemodel.AdID);
            if (model != null)
            {
                model = GetModel(model, updatemodel);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[AdvertisementManager Method(UpdateAdvertisement): 更新提交出错adid=" + updatemodel.AdID + "]更新提交出错！");
                }
            }
            else
            {
                throw new BadRequestException("[AdvertisementManager Method(UpdateAdvertisement): AdvertisementCreateRequest is null]未获取到提交更新的数据！");
            }
        }
        /// <summary>
        /// 增加点击量
        /// </summary>
        /// <param name="id"></param>
        public void AddTraffic(Guid id)
        {
            Advertisement model = SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.FirstOrDefault(m => m.AdID == id);
            if (model != null)
            {
                model.Hits = model.Hits + 1;
            }
            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
        }

        /// <summary>
        /// 根据主键删除数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void DeleteAdvertisement(Guid id)
        {
            Advertisement advertisement = SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.FirstOrDefault(m => m.AdID == id);
            if (advertisement != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.Advertisement.Remove(advertisement);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[AdvertisementManager Method(DeleteAdvertisement): 删除提交出错id=" + id + "]删除数据出错,请联系管理员！");
                }
            }
            else
            {
                throw new BadRequestException("[AdvertisementManager Method(DeleteAdvertisement): Advertisement is null id=" + id + "]未获取到要删除的信息！");
            }
        }

        public void DeleteAavertisementsManage(AdvertisementDeleteRequest advertisementDeleteRequest)
        {
            if (advertisementDeleteRequest != null)
            {
                string ids = advertisementDeleteRequest.Ads;
                string[] idArray = ids.Split('|');
                foreach (string s in idArray)
                {
                    if (!string.IsNullOrEmpty(s))
                    {
                        DeleteAdvertisement(new Guid(s));
                    }
                }

            }
            else
            {
                throw new BadRequestException(
                    "[AdvertisementManager Method(DeleteAavertisementsManage): AdvertisementDeleteRequest is null]API 参数有错误！");
            }
        }

        private Advertisement GetModel(Advertisement model, Advertisement AdvertisementDTO)
        {
            if (AdvertisementDTO != null)
            {
                model.AdID = AdvertisementDTO.AdID;
                model.CreatedBy = AdvertisementDTO.CreatedBy;
                model.Description = AdvertisementDTO.Description;
                model.Hits = AdvertisementDTO.Hits;
                model.Picture = AdvertisementDTO.Picture;
                model.Status = AdvertisementDTO.Status;
                model.Url = AdvertisementDTO.Url;
                model.Module = AdvertisementDTO.Module;
                return model;
            }
            else
            {
                return null;
            }
        }


        private AdvertisementDTO GetModelDTO(Advertisement model, AdvertisementDTO AdvertisementDTO)
        {
            if (model != null)
            {

               
                AdvertisementDTO.AdID = model.AdID;
                AdvertisementDTO.CreatedBy = model.CreatedBy;
                AdvertisementDTO.Description = model.Description;
                AdvertisementDTO.Hits = model.Hits;
                AdvertisementDTO.Picture = "";
                if (!string.IsNullOrEmpty(model.Picture))
                {
                    AdvertisementDTO.Picture = Utility.GetServicesUrl() + model.Picture;
                }
                AdvertisementDTO.Status = model.Status;
                AdvertisementDTO.StatusDes = GetEnumDes(model.Status);
                AdvertisementDTO.Url = model.Url;
                AdvertisementDTO.Module = model.Module;
                AdvertisementDTO.Sort = model.Sort;
                AdvertisementDTO.IsShow = model.IsShow;
                return AdvertisementDTO;
            }
            else
            {
                return null;
            }
        }

        private string GetEnumDes(string code)
        {
            var approveIncubatorStatus =
                from SISPIncubatorOnlineEnum.FieldStatus e in Enum.GetValues(typeof(SISPIncubatorOnlineEnum.FieldStatus))
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