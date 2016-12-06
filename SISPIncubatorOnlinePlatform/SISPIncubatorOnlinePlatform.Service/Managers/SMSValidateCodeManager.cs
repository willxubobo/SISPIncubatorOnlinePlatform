using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class SMSValidateCodeManager : BaseManager
    {
        /// <summary>
        /// 保存验证码
        /// </summary>
        /// <param name="dictionaryCreateRequest"></param>
        /// <returns></returns>
        public void Add(SMSValidateCodeCeateRequest dictionaryCreateRequest,out string code)
        {
            Guid guid = new Guid();
            string validateCode = string.Empty;
            if (dictionaryCreateRequest.SmsValidateCode != null)
            {
                SMSValidateCode smsValidateCode = dictionaryCreateRequest.SmsValidateCode;
                
                validateCode = Utility.CreateValidateCode(4);
                smsValidateCode.Code = validateCode; 
                guid = Guid.NewGuid();
                smsValidateCode.ID = guid;
                smsValidateCode.Created = DateTime.Now;
                SISPIncubatorOnlinePlatformEntitiesInstance.SMSValidateCode.Add(smsValidateCode);
                
                //发送手机短信功能
                if (!SMSHelper.SendSMS(smsValidateCode.Mobile, validateCode))
                {
                    LoggerHelper.Error("[SMSValidateCodeManager Method(Add): 发送手机验证码失败，手机号：" + smsValidateCode.Mobile +
                                          ",验证码：" + validateCode + "]未能正确发送验证码！");

                    throw new BadRequestException("[SMSValidateCodeManager Method(Add): 发送手机验证码失败，手机号：" + smsValidateCode.Mobile +
                                          ",验证码：" + validateCode+"]未能正确发送验证码！");
                }
                else
                {
                    if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                    {
                        LoggerHelper.Error("[SMSValidateCodeManager Method(Add):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail 发送手机验证码失败，手机号：" + smsValidateCode.Mobile +
                                          ",验证码：" + validateCode + "]未能正确发送验证码！");
                        throw new BadRequestException("[SMSValidateCodeManager Method(Add):SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail 发送手机验证码失败，手机号：" + smsValidateCode.Mobile +
                                          ",验证码：" + validateCode + "]未能正确发送验证码！");
                    }
                }
            }
            else
            {
                LoggerHelper.Error("[SMSValidateCodeManager Method(Add):dictionaryCreateRequest.SmsValidateCode is null 发送手机验证码失败]未能正确发送验证码！");
                throw new BadRequestException("[SMSValidateCodeManager Method(Add):dictionaryCreateRequest.SmsValidateCode is null 发送手机验证码失败]未能正确发送验证码！");
            }
            code = validateCode;
        }

        /// <summary>
        /// 删除记录
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void Delete(Guid id)
        {
            SMSValidateCode smsValidateCode = SISPIncubatorOnlinePlatformEntitiesInstance.SMSValidateCode.FirstOrDefault(p => p.ID == id);
            if (smsValidateCode != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.SMSValidateCode.Remove(smsValidateCode);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[SMSValidateCodeManager Method(Delete): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确删除验证码信息！");
                }
            }
            else
            {
                throw new BadRequestException("[SMSValidateCodeManager Method(Delete): smsValidateCode is null id=" + id+"]未能正确删除验证码信息！");
            }
        }

        /// <summary>
        /// 得到列表数据
        /// </summary>
        /// <param name="conditions"></param>
        /// <returns></returns>
        public List<SMSValidateCode> GetAll(SMSValidateCodeRequest conditions)
        {

            List<SMSValidateCode> list = new List<SMSValidateCode>();
            if (conditions != null)
            {

                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);

                list =
                    SISPIncubatorOnlinePlatformEntitiesInstance.SMSValidateCode.OrderBy(p => p.Created)
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize)
                        .ToList<SMSValidateCode>();
            }
            else
            {
                throw new BadRequestException("[SMSValidateCodeManager Method(GetAll): SMSValidateCodeRequest is null;]未能正确获取查询条件！");
            }
            return list;
        }

        /// <summary>
        /// 验证验证码的合法性
        /// </summary>
        /// <param name="code"></param>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public bool CheckValidateCode(string code,string mobile)
        {
            bool renResult = false;
            //失效时间（单位:分）
            string expiredDate = string.IsNullOrEmpty(ConfigurationManager.AppSettings["ExpiredDate"]) ? "1" : ConfigurationManager.AppSettings["ExpiredDate"];
            
            if (!string.IsNullOrEmpty(code)&&!string.IsNullOrEmpty(mobile))
            {
                double doubleExpired = Convert.ToDouble(expiredDate);
                doubleExpired = -doubleExpired;
                DateTime dtS = DateTime.Now.AddMinutes(doubleExpired);

                var smsCode=SISPIncubatorOnlinePlatformEntitiesInstance.SMSValidateCode.FirstOrDefault(
                    p => p.Code == code && p.Mobile == mobile && p.Created >= dtS);
                if (smsCode != null)
                {
                    renResult = true;
                }
                else
                {
                    LoggerHelper.Error("SMSValidateCodeManager Method(CheckValidateCode): smsCode is null;");
                }
            }
            else
            {
                LoggerHelper.Error("SMSValidateCodeManager Method(CheckValidateCode): code or mobile is null;");
            }
            return renResult;
        }
        /// <summary>
        /// 验证验证码的合法性
        /// </summary>
        /// <param name="dictionaryCreateRequest"></param>
        /// <returns></returns>
        public bool CheckValidateCode(SMSValidateCodeCeateRequest dictionaryCreateRequest)
        {
            return CheckValidateCode(dictionaryCreateRequest.SmsValidateCode.Code, dictionaryCreateRequest.SmsValidateCode.Mobile);
        }
    }
}