using SISPIncubatorOnlinePlatform.Service.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class BiddingResponse : BusinessResponse<BiddingDTO>
    {
        public IList<List<BiddingDTO>> ResultLists { get; set; }
    }
}