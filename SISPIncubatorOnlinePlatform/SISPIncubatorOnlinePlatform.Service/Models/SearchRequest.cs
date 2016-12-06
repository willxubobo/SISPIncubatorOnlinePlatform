using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Models
{
    public class SearchRequest : BusinessRequest
    {
        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }

        public string SearchString { get; set; }

        // which is the column
        public string SortCriteria { get; set; }
        //[asc, desc]
        public string SortDirection { get; set; }
        // [numeric, alphanumeric]
        public string SortAlgorithm { get; set; }
    }
}