using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class AgreementAttachmentManagement : BaseManager
    {
        /// <summary>
        /// 添加协议
        /// </summary>
        public void AddAgreementAttachment()
        {
            string incubatorApplyId = System.Web.HttpContext.Current.Request.Params["IncubatorApplyId"];
            string deleteIds = System.Web.HttpContext.Current.Request.Params["DeleteIds"];//允许上传的后缀名


            AgreementAttachment agreementAttachment = null;

            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string filePath = "";
            if (hfc.Count > 0)
            {
                //新增附件
                for (int i = 0; i < hfc.Count; i++)
                {
                   if(hfc[i].ContentLength<=0)continue;

                    agreementAttachment = new AgreementAttachment();
                    User user = UserHelper.CurrentUser;
                    agreementAttachment.Created = DateTime.Now;
                    agreementAttachment.AttachementID = Guid.NewGuid();
                    agreementAttachment.CreatedBy = user.UserID;
                    agreementAttachment.IncubatorApplyID = new Guid(incubatorApplyId);

                    string fileExtension = Path.GetExtension(hfc[i].FileName).ToLower();
                    string fileName = Path.GetFileName(hfc[i].FileName);
                    agreementAttachment.FileName = fileName.Split('.')[0];

                    string fileUploadFolder = ConfigurationManager.AppSettings["IncubatorAgreementFolder"];
                    string PhysicalPath = HttpContext.Current.Server.MapPath(fileUploadFolder);
                    if (!Directory.Exists(PhysicalPath))
                    {
                        Directory.CreateDirectory(PhysicalPath);
                    }
                    string fname = fileName.Split('.')[0] + DateTime.Now.ToString("yyyyMMddHHss") + fileExtension;
                    filePath = fileUploadFolder + "/" + fname;
                    string savepath = PhysicalPath + "/" + fname;
                    hfc[i].SaveAs(savepath);
                    agreementAttachment.FileUrl = filePath;
                    SISPIncubatorOnlinePlatformEntitiesInstance.AgreementAttachment.Add(agreementAttachment);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
            }
            //删除附件
            if (!string.IsNullOrEmpty(deleteIds))
            {
                string[] deletIds = deleteIds.Split('|');
                foreach (string s in deletIds)
                {
                    if (!string.IsNullOrEmpty(s))
                    {
                        AgreementAttachment agreement = SISPIncubatorOnlinePlatformEntitiesInstance.AgreementAttachment.FirstOrDefault(
                              p => p.AttachementID == new Guid(s));
                        SISPIncubatorOnlinePlatformEntitiesInstance.AgreementAttachment.Remove(agreement);

                        string physicalPath= HttpContext.Current.Server.MapPath(agreement.FileUrl);

                        FileInfo myfile = new FileInfo(physicalPath);
                        bool isDel = false;
                        try
                        {
                            if (myfile.Exists)
                            {
                                FileStream fs = myfile.Create();
                                fs.Close();
                                myfile.Refresh();
                                myfile.Delete();
                                isDel = true;
                            }
                        }
                        catch (Exception)
                        {
                            isDel = false;
                        }
                        if (isDel)
                        {
                            SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                        }
                        //SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                    }
                }
            }

        }

        /// <summary>
        /// 添加协议模版
        /// </summary>
        public void AddAgreementTemplate()
        {
            string incubatorId = System.Web.HttpContext.Current.Request.Params["IncubatorApplyId"];


            AgreementTemplate agreementTemplate = null;

            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            string filePath = "";
            if (hfc.Count > 0)
            {
                //新增附件
                for (int i = 0; i < hfc.Count; i++)
                {
                    agreementTemplate=new AgreementTemplate();

                    agreementTemplate=SISPIncubatorOnlinePlatformEntitiesInstance.AgreementTemplate.FirstOrDefault(
                        p => p.IncubatorID == new Guid(incubatorId));
                    if (agreementTemplate != null)
                    {
                        SISPIncubatorOnlinePlatformEntitiesInstance.AgreementTemplate.Remove(agreementTemplate);
                        SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                    }

                    agreementTemplate = new AgreementTemplate();
                    User user = UserHelper.CurrentUser;
                    agreementTemplate.Created = DateTime.Now;
                    agreementTemplate.AttachmentID = Guid.NewGuid();
                    agreementTemplate.CreatedBy = user.UserID;
                    agreementTemplate.IncubatorID = new Guid(incubatorId);

                    string fileExtension = Path.GetExtension(hfc[i].FileName).ToLower();
                    string fileName = Path.GetFileName(hfc[i].FileName);
                    agreementTemplate.FileName = fileName.Split('.')[0];

                    string fileUploadFolder = ConfigurationManager.AppSettings["IncubatorTemplateFolder"];
                    string PhysicalPath = HttpContext.Current.Server.MapPath(fileUploadFolder);
                    if (!Directory.Exists(PhysicalPath))
                    {
                        Directory.CreateDirectory(PhysicalPath);
                    }
                    string fname = fileName.Split('.')[0] + DateTime.Now.ToString("yyyyMMddHHss") + fileExtension;
                    filePath = fileUploadFolder + "/" + fname;
                    string savepath = PhysicalPath + "/" + fname;
                    hfc[0].SaveAs(savepath);
                    agreementTemplate.FileUrl = filePath;
                    SISPIncubatorOnlinePlatformEntitiesInstance.AgreementTemplate.Add(agreementTemplate);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();

                }
            }
        }

    }
}