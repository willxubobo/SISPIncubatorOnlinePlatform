using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Managers;
using SISPIncubatorOnlinePlatform.Service.Models;
using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using SISPIncubatorOnlinePlatform.Service.OAuth;

namespace SISPIncubatorOnlinePlatform.Service.Controllers
{
    [RoutePrefix("api")]
    public class RolesController : BaseController
    {
        RolesManager _rolesManager = new RolesManager();

        [HttpPost]
        [Route("roles")]
        public IHttpActionResult GetRoles(RolesRequest rolesRequest)
        {
            RolesResponse rolesResponse = new RolesResponse();
            int totalCount = 0;
            List<Entities.Roles> list = _rolesManager.GetPcAllByCondition(rolesRequest, out totalCount);
            List<RolesDTO> dtoList = new List<RolesDTO>();
            Utility.CopyList<Entities.Roles, RolesDTO>(list, dtoList);

            rolesResponse.Results = dtoList;
            rolesResponse.TotalCount = totalCount;

            return Ok(rolesResponse);
        }

        [HttpPost]
        [Route("roles/all")]
        public IHttpActionResult GetAll()
        {
            RolesResponse rolesResponse = new RolesResponse();
            int totalCount = 0;
            List<Entities.Roles> list = _rolesManager.GetAll();
            List<RolesDTO> dtoList = new List<RolesDTO>();
            Utility.CopyList<Entities.Roles, RolesDTO>(list, dtoList);

            rolesResponse.Results = dtoList;
            rolesResponse.TotalCount = totalCount;

            return Ok(rolesResponse);
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpPost]
        [Route("role")]
        public IHttpActionResult CreateRole(Models.RolesCreateRequest rolesCreateRequest)
        {
            _rolesManager.CreateRole(rolesCreateRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpPut]
        [Route("role")]
        public IHttpActionResult UpdateRole(RolesCreateRequest rolesCreateRequest)
        {
            _rolesManager.UpdateRole(rolesCreateRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpGet]
        [Route("role/{id:Guid}")]
        public IHttpActionResult GetFinancingRequirement(Guid id)
        {
            Roles roles = _rolesManager.GetRole(id);
            Dictionary<string, string> roleProperties = null;
            if (roles != null)
            {
                roleProperties = new Dictionary<string, string>
                {
                    {
                      "roleid", roles.RoleID.ToString()
                    },
                    {
                      "role_name", roles.RoleName
                    },
                    {
                      "is_admin", roles.IsAdmin.ToString()
                    },
                    {
                      "role_description", roles.Description
                    },
                };
            }
            return Ok(roleProperties);
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpDelete]
        [Route("role/{RoleID:Guid}")]
        public IHttpActionResult DeleteRole(Guid RoleID)
        {
            _rolesManager.DeleteRole(RoleID);
            return Ok();
        }

    }
}
