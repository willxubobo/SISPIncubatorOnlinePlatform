using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ServicePublishDTO
    {
        public System.Guid ServiceID { get; set; }
        public string CompanyName { get; set; }
        public string Industry { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public string Category { get; set; }
        public string PhoneNumber { get; set; }
        public string Status { get; set; }
        public string ImgUrl { get; set; }
        public string IndustryName { get; set; }
        public Nullable<bool> IsShow { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }

        public Nullable<System.DateTime> ExpiryDate { get; set; }
    }
}