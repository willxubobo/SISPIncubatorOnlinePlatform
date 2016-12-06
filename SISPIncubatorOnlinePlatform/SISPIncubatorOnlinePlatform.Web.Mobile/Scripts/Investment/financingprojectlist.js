var page = 0;

$(function () {
    GetData(page, 0);
});
function GetData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        KeyWord: $.trim($("#ProductionName").val())
    }
    var parameter = {
        requestUri: "/api/financingrequirements",
        requestParameters: searchObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               $(".nodata").hide();
               $('#projectList').show();
               var results = data.results;
               if (data.results.length > 0) {
                   GetHtml(results, type);
                   CheckLoadMoreShowOrHide(results);
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
    if ($("#projectList li").length < 10 || results.length <= 0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

function GetHtml(data, type) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        var isf = 0;
        if (data[i].isFollowed) {
            isf = 1;
        }
        htmlItem += "<li><div class=\"PLDiv li" + i + "\"> <div class=\"PLPic\" onclick=\"showinfo('" + data[i].frid + "','" + isf + "','" + data[i].followID + "','" + data[i].userID + "','" + data[i].userName + "');\"><img src=\"" + data[i].projectLogo + "\" alt=\"\" /></div>";
        htmlItem += "<div class=\"PLTxt\" onclick=\"showinfo('" + data[i].frid + "','" + isf + "','" + data[i].followID + "','" + data[i].userID + "','" + data[i].userName + "');\"><p class=\"PLTitle\" title=\"" + data[i].productionName + "\">" + data[i].productionName + "</p><p class=\"PLInfoTxt\">所属行业：" + data[i].industryName + "    融资金额：" + data[i].financingAmount + "万</p>";
        htmlItem += "<p class=\"PLInfoTxt FollowC\">关注数：" + data[i].followCount + "次</p></div>";
        if (isf==1) {
            htmlItem += " <input class=\"PLBtn PLRightBtn\" type=\"button\" onclick=\"UnFollowProject('" + data[i].frid + "','" + data[i].followID + "','li" + i + "','" + data[i].followCount + "');return false;\"  />";
        } else {
            htmlItem += " <input class=\"PLBtn PLaddBtn\" type=\"button\" onclick=\"FollowProject('" + data[i].frid + "','li" + i + "','" + data[i].followCount + "');return false;\" />";
        }
        htmlItem += " <input class=\"PLBtn PLChatBtn\" type=\"button\" onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\"/></div></li>";
    }
    if (htmlItem != "") {
        if (type == 0) {
            $('#projectList').append(htmlItem);
        } else {
            $('#projectList').empty();
            $('#projectList').append(htmlItem);
        }
    }
}
//暂无数据
function nodata() {
    //var htmlItem = "<li>暂无数据！</li>";
    $(".nodata").show();
    $('#projectList').empty().hide();
    //$('#projectList').append(htmlItem);
}
//详情
function showinfo(id,isf,fid,uid,uname) {
   window.location.href = "financingprojectinfo.html?frid=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname) + "&uid=" + uid;
}
//申请发布
function applypublish() {
   window.location.href = "financingrequirementspublish.html";
}
//关注
function FollowProject(obj, lname, followcount) {
    ShowLoading();
    var frPublish = {
        FRID: obj,
        FollowType:"0"
    };

    var formObj = {
        "FinancingRequirementFollow": frPublish
    };
    var parameter = {
        requestUri: "/api/financingrequirementfollow",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            $(this).alert("关注成功！");
            var fcount = parseInt(followcount) + 1;
            $("." + lname).find(".PLaddBtn").addClass("PLRightBtn").removeClass("PLaddBtn").attr("onclick", "UnFollowProject('" + obj + "','" + result + "','" + lname + "','" + fcount + "')");
            $("." + lname).find(".FollowC").html("关注数：" + fcount + "次");
            $("." + lname).find(".PLPic").attr("onclick", "showinfo('" + obj + "','1','" + result + "');");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//取消关注
function UnFollowProject(frid, obj, lname, fcount) {
    ShowLoading();
    var formObj = {
    };
    var parameter = {
        requestUri: "/api/financingrequirementfollow/" + obj,
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/delete",
        data: parameterJson,
        success: function (result) {
            $(this).alert("取消关注成功！");
            fcount = parseInt(fcount) - 1;
            $("." + lname).find(".PLRightBtn").addClass("PLaddBtn").removeClass("PLRightBtn").attr("onclick", "FollowProject('" + frid + "','" + lname + "','" + fcount + "')");
            $("." + lname).find(".FollowC").html("关注数：" + fcount + "次");
            $("." + lname).find(".PLPic").attr("onclick", "showinfo('" + frid + "','0','');");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}