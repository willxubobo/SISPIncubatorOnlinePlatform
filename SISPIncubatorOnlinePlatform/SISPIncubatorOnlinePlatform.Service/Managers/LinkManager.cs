using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SISPIncubatorOnlinePlatform.Service.Common;
using SISPIncubatorOnlinePlatform.Service.Entities;
using SISPIncubatorOnlinePlatform.Service.Exceptions;
using SISPIncubatorOnlinePlatform.Service.Models;

namespace SISPIncubatorOnlinePlatform.Service.Managers
{
    public class LinkManager:BaseManager
    {
        public List<LinkList> GetAll(LinkListRequest linkListRequest,out int TotalCount)
        {
            int pageSize = Convert.ToInt32(linkListRequest.PageSize);
            int pageIndex = Convert.ToInt32(linkListRequest.PageNumber);
            List<LinkList> listLinkList = new List<LinkList>();

            List<LinkList> tempList = SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.Where(p=>p.Title.Contains(linkListRequest.KeyWord)&&p.Status==true).OrderByDescending(p=>p.Sort)
                    .ToList();
            TotalCount = tempList.Count;
            listLinkList = tempList.Skip(pageSize * pageIndex).Take(pageSize).ToList();
            return listLinkList;
        }

        /// <summary>
        /// 创建链接
        /// </summary>
        /// <param name="linkListCreateRequest"></param>
        /// <returns></returns>
        public void CreateLink(LinkListCreateRequest linkListCreateRequest)
        {
            User user = UserHelper.CurrentUser;
            LinkList linkList = linkListCreateRequest.LinkList;
            if (linkList != null)
            {
                LinkList modelLinkList =
                    SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.FirstOrDefault(u => u.Title == linkList.Title);
                if (modelLinkList == null)
                {
                    linkList.LinkID = Guid.NewGuid();
                    linkList.Created = DateTime.Now;
                    linkList.Status = true;
                    linkList.CreatedBy = user.UserID;
                    SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.Add(linkList);
                    SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges();
                }
                else
                {
                    throw new ConflictException("已存在名称为：" + linkList.Title + " 的链接！");
                }
            }
            else
            {
                throw new BadRequestException("[LinkListManager Method(CreateLink): linkListCreateRequest is null]未获取到要创建的链接信息！");
            }
        }

        /// <summary>
        /// 获取链接信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public LinkList GetLink(Guid id)
        {
            LinkList linkList =
                SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.FirstOrDefault(u => u.LinkID == id);
            return linkList;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="linkListCreateRequest"></param>
        /// <returns></returns>
        public void UpdateLink(LinkListCreateRequest linkListCreateRequest)
        {
            User user = UserHelper.CurrentUser;
            LinkList updatemodel = linkListCreateRequest.LinkList;
            if (updatemodel == null)
            {
                throw new BadRequestException("[LinkListManager Method(void UpdateLink): linkListCreateRequest is null]未获取到要更新的链接信息！");
            };
            LinkList model = SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.FirstOrDefault(m => m.LinkID == updatemodel.LinkID);
            if (model != null)
            {
                if (model.Title.Trim() != updatemodel.Title.Trim())
                {
                    LinkList modelLinkList =
                    SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.FirstOrDefault(u => u.Title == updatemodel.Title);
                    if (modelLinkList != null)//判断更改后的角色名是否有重复
                    {
                        throw new ConflictException("已存在名称为：" + updatemodel.Title + " 的链接！");
                    }
                }
                model.Title = updatemodel.Title;
                model.Url = updatemodel.Url;
                model.Sort = updatemodel.Sort;
                model.CreatedBy = user.UserID;
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() < 0)
                {
                    throw new BadRequestException("[LinkListManager Method(void UpdateLink): 更新提交出错ID=" + updatemodel.LinkID + "]更新提交出错!");
                }
            }
            else
            {
                throw new BadRequestException("[LinkListManager Method(void UpdateLink): linkListCreateRequest is null ID=" + updatemodel.LinkID + "]未获取到角色信息！");
            }
        }

        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public void DeleteLink(Guid ID)
        {
            LinkList model = SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.FirstOrDefault(m => m.LinkID == ID);
            if (model != null)
            {
                SISPIncubatorOnlinePlatformEntitiesInstance.LinkList.Remove(model);
                if (SISPIncubatorOnlinePlatformEntitiesInstance.SaveChanges() <= 0)
                {
                    throw new BadRequestException("[LinkListManager Method(DeleteLink): 删除提交出错id=" + ID + "]删除提交失败！");
                }
            }
            else
            {
                throw new BadRequestException("[LinkListManager Method(DeleteLink): ID is null,id=" + ID + "]未获取到要删除的数据！");
            }
        }
    }
}