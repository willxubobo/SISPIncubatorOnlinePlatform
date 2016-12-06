using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class ActivityDetailRequest
    {
        [Required(ErrorMessage = "必填")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "必填")]
        public int Category { get; set; }
    }
}