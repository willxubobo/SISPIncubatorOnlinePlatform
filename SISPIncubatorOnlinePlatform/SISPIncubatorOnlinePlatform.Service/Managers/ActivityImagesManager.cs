using SISPIncubatorOnlinePlatform.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System.Configuration;
using System.IO;
using log4net.Util;
using SISPIncubatorOnlinePlatform.Service.Exceptions;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class ActivityImagesManager : BaseManager
    {
        public void CreateActivityImages(ActivityImagesRequest activityImagesRequest)
        {
            WeiXinRequest weiXinRequest = activityImagesRequest.WeiXinRequest;
            string imgs = activityImagesRequest.DelImgs;
            if (weiXinRequest != null)
            {
                WeiXinManager weiXinManager = new WeiXinManager();
                weiXinManager.GetMultimedia(weiXinRequest);
                if (!string.IsNullOrEmpty(activityImagesRequest.ActivityImages.FileName))
                {
                    var fileName = activityImagesRequest.ActivityImages.FileName;
                    var fileNames = fileName.Substring(0, fileName.Length - 1).Split(',');
                    var newfileName = string.Empty;
                    for (int i = 0; i < fileNames.Length; i++)
                    {
                        newfileName += string.Concat(fileNames[i], ".jpg",",");
                    }
                    activityImagesRequest.ActivityImages.FileName = newfileName;
                }
            }
            else
            {
                throw new BadRequestException("[ActivityImagesManager Method(CreateActivityImages): WeiXinRequest is null]上传图片失败！");
            }
            if (!string.IsNullOrEmpty(imgs))
            {
                imgs = imgs.Substring(0, imgs.Length - 1);
                string[] imgArry = imgs.Split(',');
                foreach (var imgsrc in imgArry)
                {
                    DelActivityImages(imgsrc);
                }
            }
            if (!string.IsNullOrEmpty(activityImagesRequest.ActivityImages.FileName))
            {
                var activityId = activityImagesRequest.ActivityImages.ActivityID;
                var fileName = activityImagesRequest.ActivityImages.FileName;
                var fileNames = fileName.Substring(0, fileName.Length - 1).Split(',');
                for (int i = 0; i < fileNames.Length; i++)
                {
                    ActivityImages activityImages = new ActivityImages
                    {
                        ActivityID = activityId,
                        ImgID = Guid.NewGuid(),
                        ImgSrc = fileNames[i],
                        Sort = i
                    };
                    SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Add(activityImages);
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
        }

        public ActivityImagesResponse GetActivityImages(Guid id)
        {
            ActivityImagesResponse activityImagesResponse=new ActivityImagesResponse();
            activityImagesResponse.Results=new List<ActivityImagesResponseDTO>();
            var activityImageses = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Where(x => x.ActivityID == id).ToList();
            string activityPath =  ConfigurationManager.AppSettings["ActivityFolder"];
            string fileUrl = string.Concat(Utility.GetServicesImageUrl(), activityPath);
            foreach (var activityImage in activityImageses)
            {
                ActivityImagesResponseDTO activityImagesResponseDto=new ActivityImagesResponseDTO();
                activityImagesResponseDto.ActivityID = activityImage.ActivityID;
                activityImagesResponseDto.ImgID = activityImage.ImgID;
                activityImagesResponseDto.ImgSrc = activityImage.ImgSrc;
                activityImagesResponseDto.Sort = activityImage.Sort;
                activityImagesResponseDto.MThumb = string.Concat(fileUrl,activityImage.ImgSrc.Insert(activityImage.ImgSrc.LastIndexOf('.'), "_m"));
                activityImagesResponseDto.SThumb = string.Concat(fileUrl, activityImage.ImgSrc.Insert(activityImage.ImgSrc.LastIndexOf('.'), "_s"));
                activityImagesResponse.Results.Add(activityImagesResponseDto);
            }
            return activityImagesResponse;
        }

        public void DelActivityImages(string imgSrc)
        {
            var activityImage = SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.FirstOrDefault(x => x.ImgSrc == imgSrc);
            if (activityImage != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.ActivityImages.Remove(activityImage);
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                try
                {
                    var fileUrl = System.Web.HttpContext.Current.Server.MapPath("./");   
                    string filePath = string.Concat(fileUrl, imgSrc);
                    string mFilePath = string.Concat(fileUrl, imgSrc.Insert(imgSrc.LastIndexOf('.'), "_m"));
                    string sFilePath = string.Concat(fileUrl, imgSrc.Insert(imgSrc.LastIndexOf('.'), "_s"));
                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                    }
                    if (File.Exists(filePath))
                    {
                        File.Delete(mFilePath);
                    }
                    if (File.Exists(filePath))
                    {
                        File.Delete(sFilePath);
                    }
                }
                catch (Exception)
                {
                   
                }
            }
        }
    }
}