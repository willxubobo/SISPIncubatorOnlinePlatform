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
    public class LinkController : BaseController
    {
        LinkManager _linklistsManager =new LinkManager();
        [HttpPost]
        [Route("linklists")]
        public IHttpActionResult GetLinkLists(LinkListRequest linklistsRequest)
        {
            LinkListResponse linklistsResponse = new LinkListResponse();
            int totalCount = 0;
            List<Entities.LinkList> list = _linklistsManager.GetAll(linklistsRequest, out totalCount);
            List<LinkListDTO> dtoList = new List<LinkListDTO>();
            Utility.CopyList<Entities.LinkList, LinkListDTO>(list, dtoList);

            linklistsResponse.Results = dtoList;
            linklistsResponse.TotalCount = totalCount;

            return Ok(linklistsResponse);
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpPost]
        [Route("linklist")]
        public IHttpActionResult CreateLink(Models.LinkListCreateRequest linklistsCreateRequest)
        {
            _linklistsManager.CreateLink(linklistsCreateRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpPut]
        [Route("linklist")]
        public IHttpActionResult UpdateLink(LinkListCreateRequest linklistsCreateRequest)
        {
            _linklistsManager.UpdateLink(linklistsCreateRequest);
            return Ok();
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpGet]
        [Route("linklist/{id:Guid}")]
        public IHttpActionResult GetLink(Guid id)
        {
            LinkList linklists = _linklistsManager.GetLink(id);
            Dictionary<string, string> linklistProperties = null;
            if (linklists != null)
            {
                linklistProperties = new Dictionary<string, string>
                {
                    {
                      "linklist_id", linklists.LinkID.ToString()
                    },
                    {
                      "linklist_title", linklists.Title
                    },
                    {
                      "linklist_url", linklists.Url
                    },
                    {
                      "linklist_sort", linklists.Sort.ToString()
                    }
                };
            }
            return Ok(linklistProperties);
        }

        [SSIPActionFilter]
        [Authorize]
        [HttpDelete]
        [Route("linklist/{ID:Guid}")]
        public IHttpActionResult DeleteLink(Guid ID)
        {
            _linklistsManager.DeleteLink(ID);
            return Ok();
        }
    }
}
