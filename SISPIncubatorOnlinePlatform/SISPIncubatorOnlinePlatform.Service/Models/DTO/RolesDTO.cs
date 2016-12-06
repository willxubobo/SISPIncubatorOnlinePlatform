using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class RolesDTO
    {
        public System.Guid RoleID { get; set; }
        public string RoleName { get; set; }
        public Nullable<bool> IsAdmin { get; set; }
        public string Description { get; set; }
        public System.DateTime Created { get; set; }
    }
}