using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivitySignUpDTO
    {
        public System.Guid SignUpID { get; set; }
        public System.Guid ActivityID { get; set; }
        public string SignUpName { get; set; }
        public string PhoneNumber { get; set; }
        public string WorkingCompany { get; set; }
        public System.DateTime Created { get; set; }
        public System.Guid CreatedBy { get; set; }
    }

    public class ActivitySignUpStatsDTO
    {
        public System.Guid ActivityID { get; set; }
        public string Topic { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public int PeopleNumber { get; set; }
    }

}