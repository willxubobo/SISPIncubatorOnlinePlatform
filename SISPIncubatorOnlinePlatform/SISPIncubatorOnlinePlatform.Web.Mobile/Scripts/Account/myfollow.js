var page = 0;

$(function () {
    GetData(page, 0);
});
function InitListView() {
    $('.chatList ').mobiscroll().listview({
        theme: 'mobiscroll',
        lang: 'zh',
        // sortable: true,
        // iconSlide: true,
        // altRow: true,
        stages: [
            {
                percent: -25,
                color: 'red',
                text: '删除',
                confirm: true,
                action: function (item, inst, index) {
                    inst.remove(item);
                    var id = $(item).find("#hdMsgId").val();
                    DeleteItem(id);
                    return false;
                }
            }
        ]
    });
}
//删除单项
function DeleteItem(id) {
    var parameter = {
        requestUri: "/api/financingrequirementfollow/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/delete",
        data: jsonData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
function GetData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page
    }
    var parameter = {
        requestUri: "/api/financingrequirementfollows",
        requestParameters: searchObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               $(".nodata").hide();
               $('.chatList ').show();
               var results = data.results;
               if (data.results.length > 0) {
                   GetHtml(results, type);
                   CheckLoadMoreShowOrHide(results);
                   InitListView();
               } else {
                   if (page == 0) {
                       nodata();
                   } else {
                       $(".divLoadMore").hide();
                   }
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
//点击加载更多
function ClickLoadMore() {
    ShowLoading();
    page = page + 1;
    GetData(page, 0);
}
//判断加载更多是否出现
function CheckLoadMoreShowOrHide(results) {
    if ($(".chatList li").length < 10 || results.length <= 0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

function GetHtml(data, type) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        var imgurl = "";
        var ptitle = "";
        var followtype = "";
        var ftype = data[i].followType;
        if (ftype == "0") {//融资
            imgurl = data[i].projectLogo;
            ptitle = data[i].productionName;
            followtype = "融资项目";
        } else {
            imgurl = data[i].companyLogo;
            ptitle = data[i].companyName;
            followtype = "投资机构";
        }
        htmlItem += "<li><a class=\"chatNewsLink\" href=\"javascript:void(0)\" onclick=\"showinfo('" + ftype + "','" + data[i].frid + "');\"> <div class=\"chatNewsPic\"><img src=\"" + imgurl + "\" alt=''/></div><div class=\"chatNewsTitleBox\"><p class=\"chatNewsTitleTxt\">" + ptitle + "</p>";
        htmlItem += "<p class=\"chatNewsContent\">" + followtype + "</p></div><div class=\"chatDate\">" + data[i].created.substring(0, 10) + "</div></a> <input id='hdMsgId' value='" + data[i].followID + "' type=\"hidden\" /></li>";
        
    }
    if (htmlItem != "") {
        if (type == 0) {
            $('.chatList ').append(htmlItem);
        } else {
            $('.chatList ').empty();
            $('.chatList ').append(htmlItem);
        }
    }
}
//暂无数据
function nodata() {
    //var htmlItem = "<li>暂无数据！</li>";
    $(".nodata").show();
    $('.chatList ').empty().hide();
    //$('.chatList ').append(htmlItem);
}
//详情
function showinfo(type, id) {
    if (type == "0") {
       window.location.href = "../investment/financingprojectinfo.html?frid=" + id + "&type=detail&returnurl=" + encodeURI(location.href);
    } else {
       window.location.href = "../investor/investorinfo.html?id=" + id + "&type=detail&returnurl=" + encodeURI(location.href);
    }
}

