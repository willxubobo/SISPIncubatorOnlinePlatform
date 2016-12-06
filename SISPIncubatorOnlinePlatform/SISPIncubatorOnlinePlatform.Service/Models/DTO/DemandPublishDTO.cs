using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class DemandPublishDTO
    {
        public System.Guid DemandID { get; set; }
        public string CompanyName { get; set; }
        public string Contacts { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public System.DateTime FoundedTime { get; set; }
        public int Members { get; set; }
        public string ProjectDescription { get; set; }
        public string DemandDescription { get; set; }
        public string IntentionPartner { get; set; }
        public string Status { get; set; }
        public string ImgUrl { get; set; }
        public Nullable<bool> IsShow { get; set; }
        public System.Guid CreatedBy { get; set; }
        public System.DateTime Created { get; set; }
        public string Category { get; set; }

        public Nullable<System.DateTime> ExpiryDate { get; set; }
    }
}