using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class RoleFunctionsManager : BaseManager
    {
        /// <summary>
        /// 创建角色
        /// </summary>
        /// <param name="roleFunctionsRequest"></param>
        /// <returns></returns>
        public void CreateRoleFunctions(RoleFunctionsRequest roleFunctionsRequest)
        {
            if (!string.IsNullOrEmpty(roleFunctionsRequest.RoleID) && !string.IsNullOrEmpty(roleFunctionsRequest.FunctionsID))
            {
                Guid RoleID = Guid.Parse(roleFunctionsRequest.RoleID);
                //先删除已经添加的项
                List<Role_Functions> list =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Role_Functions.Where(d => d.RoleID == RoleID).ToList();
                SISPIncubatorOnlinePlatformEntitiesInstance.Role_Functions.RemoveRange(list);

                string[] fids = roleFunctionsRequest.FunctionsID.TrimEnd(',').Split(',');
                foreach (string fid in fids)
                {
                    Role_Functions roleFunctions = new Role_Functions();
                    roleFunctions.ID = Guid.NewGuid();
                    roleFunctions.RoleID =RoleID ;
                    roleFunctions.FunctionID = Guid.Parse(fid);
                    SISPIncubatorOnlinePlatformEntitiesInstance.Role_Functions.Add(roleFunctions);
                }
                SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
            }
            else
            {
                throw new BadRequestException("[RoleFunctionsManager Method(CreateRoleFunctions): roleFunctionsRequest is null]未获取到要创建的权限信息！");
            }
        }

        public List<Role_Functions> GetAll(RoleFunctionsRequest conditions)
        {
            List<Role_Functions> listRoles = new List<Role_Functions>();
            if (conditions != null&&!string.IsNullOrEmpty(conditions.RoleID))
            {
                Guid roleID = Guid.Parse(conditions.RoleID);
                listRoles = SISPIncubatorOnlinePlatformEntitiesInstance.Role_Functions.Where(
                        p => p.RoleID==roleID).ToList();
            }
            else
            {
                throw new BadRequestException("[RoleFunctionsManager Method(GetAll): RoleFunctionsRequest is null]未能正确获取查询条件！");
            }
            return listRoles;
        }
    }
}