using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models.DTO
{
    public class ActivityCalendarDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
    }
    public class ActivityCalendarInformationDTO
    {
        public DateTime DateTime { get; set; }
    }
}