using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class DictionaryManager:BaseManager
    {

        /// <summary>
        /// 根据查询条件获取信息
        /// </summary>
        /// <returns></returns>
        public List<Dictionary> GetAll(DictionaryRequest conditions)
        {
            if (conditions != null)
            {
                var approveRecords =
            from approveRecord in
                SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(p => p.Key.Contains(conditions.Key))
                    .OrderBy(p => p.Sort).ToList()
            select approveRecord;
                return approveRecords.ToList<Dictionary>();
            }
            else
            {
                throw new BadRequestException("[DictionaryManager Method(GetAll): DictionaryRequest conditions is null ]未能正确获取查询条件！");
            }
        }
        public List<Dictionary> GetAll(string key)
        {
            if (key != null)
            {
                var approveRecords =
            from approveRecord in
                SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(p => p.Key.Contains(key))
                    .OrderBy(p => p.Sort).ToList()
            select approveRecord;
                return approveRecords.ToList<Dictionary>();
            }
            else
            {
                throw new BadRequestException("[DictionaryManager Method(GetAll): DictionaryRequest conditions is null ]未能正确获取查询条件！");
            }
        }

        //根据编辑获取字典
        public List<Dictionary> GetAllByIDS(string ids)
        {
             List<Dictionary> list=new List<Dictionary>();
            if (!string.IsNullOrEmpty(ids))
            {
                string trimids = string.Empty;
                string[] idlist = ids.TrimEnd(',').Split(',');
                foreach (string str in idlist)
                {
                    trimids += "'" + str + "',";
                }
                string sql = "select * from [Dictionary] where id in ("+trimids.TrimEnd(',')+")";
               list = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<Dictionary>(sql).ToList();
            }
            return list;
        }

        /// <summary>
        /// 根据查询条件获取信息
        /// </summary>
        /// <returns></returns>
        public List<DictionaryDTO> GetAllByType(DictionaryRequest conditions,out int TotalCount)
        {
            List<Dictionary> list = new List<Dictionary>();
            List<DictionaryDTO> listDtos = new List<DictionaryDTO>();
            if (conditions != null)
            {
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber);
                string moduleType = (conditions.ModuleType ?? "Industry");
                List<Dictionary> approveRecords =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Where(
                        p =>
                            (p.Key == moduleType) &&
                            p.Key.Contains(conditions.Key) && p.Value.Contains(conditions.KeyWord))
                        .OrderBy(p => p.Sort).ToList();
                TotalCount = approveRecords.Count;
                list = approveRecords.Skip(pageSize * pageIndex).Take(pageSize).ToList();
                foreach (Dictionary dictionary in list)
                {
                    DictionaryDTO dictionaryDto=new DictionaryDTO();
                    dictionaryDto.ID = dictionary.ID;
                    dictionaryDto.Key = dictionary.Key;
                    dictionaryDto.Sort = dictionary.Sort;
                    dictionaryDto.Value = dictionary.Value;
                    dictionaryDto.Status = dictionary.Status;

                    string typeId = dictionary.ID.ToString();

                    if (moduleType == "Industry")
                    {
                        dictionaryDto.IsExistData =
                            SISPIncubatorOnlinePlatformEntitiesInstance.FinancingRequirements.Where(
                                p => p.Industry.Contains(typeId)).ToList().Count > 0;
                    }
                    else if (moduleType == "InvestmentStage")
                    {
                        dictionaryDto.IsExistData =
                            SISPIncubatorOnlinePlatformEntitiesInstance.InvestorInformation.Where(
                                p => p.InvestmentStage.Contains(typeId)).ToList().Count > 0;
                    }
                    listDtos.Add(dictionaryDto);
                }
                return listDtos;
            }
            else
            {
                throw new BadRequestException("[DictionaryManager Method(GetAll): DictionaryRequest conditions is null ]未能正确获取查询条件！");
            }
        }
        /// <summary>
        /// 新增基础信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public void Create(DictionaryCreateRequest request)
        {
            Guid guid = new Guid();
            if (request.Dictionary != null)
            {
                Dictionary dictionary = request.Dictionary;
                guid = Guid.NewGuid();
                dictionary.ID = guid;
                dictionary.Status = "1";
                SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Add(dictionary);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[DictionaryManager Method(Add): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确提交字典表数据！");
                }
            }
            else
            {
                throw new BadRequestException("[DictionaryManager Method(Add): request.Dictionary is null]未能正确提交字典表数据！");
            }
        }

        /// <summary>
        /// 更新基础信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public void Update(DictionaryCreateRequest request)
        {
            Guid guid = new Guid();
            if (request.Dictionary != null)
            {
                Dictionary dictionary = request.Dictionary;
                guid = dictionary.ID;
                Dictionary dictionaryDb = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.FirstOrDefault(m => m.ID == guid);
                dictionaryDb.Key = dictionary.Key;
                dictionaryDb.Value = dictionary.Value;
                dictionaryDb.Sort = 0;
                if (dictionary.Sort != null)
                {
                    dictionaryDb.Sort = dictionary.Sort;
                }
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[DictionaryManager Method(Add): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确更新字典表数据！");
                }
            }
            else
            {
                throw new BadRequestException("[DictionaryManager Method(Add):  request.Dictionary is null;]未能正确更新字典表数据！");
            }
        }

        /// <summary>
        /// 删除基础信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public void Delte(Guid id)
        {
            Dictionary dictionaryDb = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.FirstOrDefault(m => m.ID == id);
            SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.Remove(dictionaryDb);
            if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
            {
                throw new BadRequestException("[DictionaryManager Method(Delte): SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() is fail]未能正确删除字典表数据！");
            }
        }

        /// <summary>
        /// 获取基础信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Dictionary GetInformation(Guid id)
        {
            if (id==null)
            {
                throw new BadRequestException("获取字典信息失败！");
            }
            Dictionary dictionaryDb = SISPIncubatorOnlinePlatformEntitiesInstance.Dictionary.FirstOrDefault(m => m.ID == id);
            return dictionaryDb;
        }
    }
}