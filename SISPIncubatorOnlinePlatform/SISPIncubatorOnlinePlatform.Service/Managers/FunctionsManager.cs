using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System.Data.Entity.Infrastructure;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class FunctionsManager : BaseManager
    {
        /// <summary>
        /// 获取当前用户的角色菜单
        /// </summary>
        /// <returns></returns>
        public List<FunctionsDTO> GetParentFunctions(FunctionsRequest functionsRequest)
        {
            User user = UserHelper.CurrentUser;
            if (user == null)
            {
                throw new UnauthorizedException("用户未登录！");
            }
            List<SqlParameter> paralist = new List<SqlParameter>();
            string sql =
                "select * FROM [Functions] where functionid in (select FunctionID from Role_Functions where RoleID in (select RoleID from User_Roles where UserID=@UserID)) and Status=1";
            if (functionsRequest == null || string.IsNullOrEmpty(functionsRequest.ParentID))
            {
                sql += " and ParentID is NULL";
            }
            else
            {
                sql += " and ParentID=@ParentID";
                paralist.Add(new SqlParameter("@ParentID", functionsRequest.ParentID));
            }
            sql += " order by Sort asc";
            paralist.Add(new SqlParameter("@UserID", user.UserID));
            List<FunctionsDTO> list = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<FunctionsDTO>(sql, paralist.ToArray()).ToList();
            if (functionsRequest == null || string.IsNullOrEmpty(functionsRequest.ParentID))
            {
                foreach (FunctionsDTO functionsDto in list)
                {
                    paralist = new List<SqlParameter>();
                    sql =
            "select top 1 * FROM [Functions] where functionid in (select FunctionID from Role_Functions where RoleID in (select RoleID from User_Roles where UserID=@UserID)) and Status=1";
                    sql += " and ParentID=@ParentID";
                    sql += " order by Sort asc";
                    paralist.Add(new SqlParameter("@ParentID", functionsDto.FunctionID));
                    paralist.Add(new SqlParameter("@UserID", user.UserID));
                    FunctionsDTO functionsDtoNew = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<FunctionsDTO>(sql, paralist.ToArray())
                           .FirstOrDefault();
                    if (functionsDtoNew != null)
                    {
                        functionsDto.Controller = functionsDtoNew.Controller;
                    }
                }
            }
            return list;
        }

        /// <summary>
        /// 根据parentid获取子菜单
        /// </summary>
        /// <returns></returns>
        public List<FunctionsDTO> GetItemFunctions(FunctionsRequest functionsRequest)
        {
            if (functionsRequest == null || string.IsNullOrEmpty(functionsRequest.ParentID))
            {
                throw new BadRequestException("未获取到查询条件！");
            }
            Guid pid = Guid.Parse(functionsRequest.ParentID);
            List<Functions> list =
                SISPIncubatorOnlinePlatformEntitiesInstance.Functions.Where(d => d.ParentID == pid && d.Status == true)
                    .OrderBy(d => d.Sort)
                    .ToList();
            List<FunctionsDTO> dtoList = new List<FunctionsDTO>();
            Utility.CopyList<Functions, FunctionsDTO>(list, dtoList);
            return dtoList;
        }

        /// <summary>
        /// 获取所有菜单
        /// </summary>
        /// <returns></returns>
        public List<FunctionsDTO> GetFunctions(FunctionsRequest functionsRequest)
        {
            List<Functions> list =
                SISPIncubatorOnlinePlatformEntitiesInstance.Functions.Where(d => d.Status == true)
                    .OrderBy(d => d.Sort)
                    .ToList();
            List<FunctionsDTO> dtoList = new List<FunctionsDTO>();
            Utility.CopyList<Functions, FunctionsDTO>(list, dtoList);
            return dtoList;
        }

        public bool UserHasPermission(string controllerName, string actionName)
        {
            User user = UserHelper.CurrentUser;
            if (user == null)
            {
                throw new UnauthorizedException("用户未登录！");
            }

            List<SqlParameter> paralist = new List<SqlParameter>();
            string sql =
                @"select count(1) as Count from [Function_Actions] fa
                  left join Role_Functions rf on fa.FunctionID=rf.FunctionID
                  left join User_Roles ur on ur.RoleID=rf.RoleID
                    where ur.UserID=@UserID and fa.[ControllerName]=@ControllerName 
                    and [ActionName]=@ActionName";

            paralist.Add(new SqlParameter("@UserID", user.UserID));
            paralist.Add(new SqlParameter("@ControllerName", controllerName));
            paralist.Add(new SqlParameter("@ActionName", actionName));

            DbRawSqlQuery<int> result = SISPIncubatorOnlinePlatformEntitiesInstance.Database.SqlQuery<int>(sql, paralist.ToArray());
            int count = result.FirstOrDefault<int>();
            if (count > 0)
            {
                return true;
            }
            return false;
        }
    }
}