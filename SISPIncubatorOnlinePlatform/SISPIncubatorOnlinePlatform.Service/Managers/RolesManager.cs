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
    public class RolesManager : BaseManager
    {
        public List<Roles> GetPcAllByCondition(RolesRequest conditions,out int totalCount)
        {
            totalCount = 0;
            List<Roles> listRoles = new List<Roles>();
            if (conditions != null)
            {
                string keyword = conditions.KeyWord;
                string type = conditions.Type;
                int pageSize = Convert.ToInt32(conditions.PageSize);
                int pageIndex = Convert.ToInt32(conditions.PageNumber - 1);

                if (!string.IsNullOrEmpty(type) && type == "admin")
                {
                    listRoles = SISPIncubatorOnlinePlatformEntitiesInstance.Roles.Where(
                        p => (p.RoleName.Contains(keyword) || p.Description.Contains(keyword)) && p.IsAdmin == true)
                        .OrderByDescending(p => p.Created)
                        .Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();
                    totalCount = listRoles.Count;
                }
                else if (!string.IsNullOrEmpty(keyword))
                {
                    List<Roles> tempRoles = SISPIncubatorOnlinePlatformEntitiesInstance.Roles.Where(
                        p => p.RoleName.Contains(keyword) || p.Description.Contains(keyword)).ToList();
                    totalCount = tempRoles.Count;
                    listRoles = tempRoles.OrderByDescending(p => p.Created).Skip(pageSize*pageIndex)
                        .Take(pageSize).ToList();
                }
                else
                {
                    List<Roles> tempRoles = SISPIncubatorOnlinePlatformEntitiesInstance.Roles.ToList();
                    totalCount = tempRoles.Count;
                    listRoles = tempRoles.OrderByDescending(p => p.Created).Skip(pageSize * pageIndex)
                        .Take(pageSize).ToList();
                }
            }
            else
            {
                listRoles = SISPIncubatorOnlinePlatformEntitiesInstance.Roles
                        .OrderByDescending(p => p.Created).ToList();
                //LoggerHelper.Error("[IncubatorManager Method(GetPcAllByCondition): RolesRequest is null]未能正确获取查询条件！");
                //throw new BadRequestException("[IncubatorManager Method(GetPcAllByCondition): RolesRequest is null]未能正确获取查询条件！");
            }
            return listRoles;
        }

        public List<Roles> GetAll()
        {
            List<Roles> listRoles = new List<Roles>();
            
                listRoles = SISPIncubatorOnlinePlatformEntitiesInstance.Roles
                        .OrderByDescending(p => p.Created).ToList();
            return listRoles;
        }

        /// <summary>
        /// 创建角色
        /// </summary>
        /// <param name="rolesCreateRequest"></param>
        /// <returns></returns>
        public void CreateRole(RolesCreateRequest rolesCreateRequest)
        {
            Roles roles = rolesCreateRequest.Roles;
            if (roles != null)
            {
                Roles modelRoles =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Roles.FirstOrDefault(u => u.RoleName == roles.RoleName);
                if (modelRoles == null)
                {
                    roles.RoleID = Guid.NewGuid();
                    roles.Created = DateTime.Now;
                    SISPIncubatorOnlinePlatformEntitiesInstance.Roles.Add(roles);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    throw new ConflictException("已存在名称为：" + roles.RoleName + " 的角色！");
                }
            }
            else
            {
                throw new BadRequestException("[RolesManager Method(CreateRole): rolesCreateRequest is null]未获取到要创建的角色信息！");
            }
        }

        /// <summary>
        /// 获取角色信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Roles GetRole(Guid id)
        {
                Roles roles =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Roles.FirstOrDefault(u => u.RoleID==id);
            return roles;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="rolesCreateRequest"></param>
        /// <returns></returns>
        public void UpdateRole(RolesCreateRequest rolesCreateRequest)
        {
            Roles updatemodel = rolesCreateRequest.Roles;
            if (updatemodel == null)
            {
                throw new BadRequestException("[RolesManager Method(void UpdateRole): rolesCreateRequest is null]未获取到要更新的角色信息！");
            };
            Roles model = SISPIncubatorOnlinePlatformEntitiesInstance.Roles.FirstOrDefault(m => m.RoleID == updatemodel.RoleID);
            if (model != null)
            {
                if (model.RoleName.Trim() != updatemodel.RoleName.Trim())
                {
                    Roles modelRoles =
                    SISPIncubatorOnlinePlatformEntitiesInstance.Roles.FirstOrDefault(u => u.RoleName == updatemodel.RoleName);
                    if (modelRoles != null)//判断更改后的角色名是否有重复
                    {
                        throw new ConflictException("已存在名称为：" + updatemodel.RoleName + " 的角色！");
                    }
                }
                model.RoleName = updatemodel.RoleName;
                model.Description = updatemodel.Description;
                model.IsAdmin = updatemodel.IsAdmin;

                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() < 0)
                {
                    throw new BadRequestException("[RolesManager Method(void UpdateRole): 更新提交出错RoleID=" + updatemodel.RoleID + "]更新提交出错!");
                }
            }
            else
            {
                throw new BadRequestException("[RolesManager Method(void UpdateRole): rolesCreateRequest is null RoleID=" + updatemodel.RoleID + "]未获取到角色信息！");
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public void DeleteRole(Guid RoleID)
        {
            Roles model = SISPIncubatorOnlinePlatformEntitiesInstance.Roles.FirstOrDefault(m => m.RoleID == RoleID);
            if (model != null)
            {
                List<Role_Functions> roleFunctions = SISPIncubatorOnlinePlatformEntitiesInstance.Role_Functions.Where(m => m.RoleID == RoleID).ToList();
                SISPIncubatorOnlinePlatformEntitiesInstance.Role_Functions.RemoveRange(roleFunctions);

                List<User_Roles> userRoles = SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles.Where(m => m.RoleID == RoleID).ToList();
                SISPIncubatorOnlinePlatformEntitiesInstance.User_Roles.RemoveRange(userRoles);

                SISPIncubatorOnlinePlatformEntitiesInstance.Roles.Remove(model);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[UserManager Method(DeleteUser): 删除提交出错id=" + RoleID + "]删除提交失败！");
                }
            }
            else
            {
                throw new BadRequestException("[UserManager Method(DeleteUser): UserID is null,id=" + RoleID + "]未获取到要删除的数据！");
            }
        }
    }
}