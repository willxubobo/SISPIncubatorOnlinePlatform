﻿function InitHomeUserData() {
    GetfinancingprojectData();
    GetInvestData();
}
$(function () {
    GetfinancingprojectData();
});
function GetfinancingprojectData() {
    //ShowLoading();
    var searchObj = {
        PageSize: "10"
    }
    var parameter = {
        requestUri: "/api/financingrequirements/pc",
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
               $('#financingproject').show();
               var results = data.results;
               if (results != null && results != undefined && results.length > 0) {
                   //$("#divprojectNodata").hide();
                   GetfinancingprojectHtml(results);
                   //CheckLoadMoreShowOrHide(results);
               } else {
                   //$('#financingproject').empty();
                   //$("#divprojectNodata").show();
               }
               InitPlug();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}


function GetfinancingprojectHtml(data) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        var isf = 0;
        if (data[i].isFollowed) {
            isf = 1;
        }
        var pname = data[i].productionName;
        if (pname.length > 12) {
            pname = pname.substr(0, 12) + "...";
        }
        var inName = data[i].industryName;
        if (inName.length > 12) {
            inName = inName.substr(0, 12) + "...";
        }
        htmlItem += "<li class=\"li" + i + "\"><img class=\"PLPicTitle\" onload=\"AutoResizeImage(312,179,this)\" style=\"width:312px;height:179px;cursor:pointer;\" src=\"" + data[i].projectLogo + "\" onclick=\"showinfo('" + data[i].frid + "','" + isf + "','" + data[i].followID + "','" + data[i].userID + "','" + data[i].userName + "');\"/><div class=\"divItem_title\" title=\"" + data[i].productionName + "\">" + pname + "</div>";
        htmlItem += "<div class=\"divItem_industry\" title=\"" + data[i].industryName + "\">所属行业：" + inName + "</div><div class=\"divItem_amount\">融资金额：" + data[i].financingAmount + "万</div>";
        htmlItem += "<div class=\"divItem_attention\"><span>关注数 :</span><span class=\"FollowC\">" + data[i].followCount + "</span><span>次</span></div>";
        if (isf==1) {
            htmlItem += "<div class=\"divItem_action divConcerned\" onclick=\"UnFollowProject('" + data[i].frid + "','" + data[i].followID + "','li" + i + "','" + data[i].followCount + "','" + data[i].userID + "','" + data[i].userName + "');return false;\">已关注</div>";
        } else {
            htmlItem += "<div class=\"divItem_action nofollow\" onclick=\"FollowProject('" + data[i].frid + "','li" + i + "','" + data[i].followCount + "','" + data[i].userID + "','" + data[i].userName + "');return false;\" >关注</div>";
        }
        htmlItem += "</li>";
    }
    $('#financingproject').append(htmlItem);
}
//暂无数据
function nodata() {
    //var htmlItem = "<li>暂无数据！</li>";
    $(".nodata").show();
    $('#financingproject').empty().hide();
    //$('#financingproject').append(htmlItem);
}
//详情
function showinfo(id,isf,fid,uid,uname) {
    window.open("Investment/financingprojectinfo.html?frid=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname) + "&uid=" + uid);
}

//关注
function FollowProject(obj, lname, followcount, uid, uname) {
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
            $("." + lname).find(".nofollow").addClass("divConcerned").removeClass("nofollow").attr("onclick", "UnFollowProject('" + obj + "','" + result + "','" + lname + "','" + fcount + "','" + uid + "','" + uname + "')").html("已关注");
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".PLPicTitle").attr("onclick", "showinfo('" + obj + "','1','" + result + "','" + uid + "','" + uname + "');");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//取消关注
function UnFollowProject(frid, obj, lname, fcount, uid, uname) {
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
            $("." + lname).find(".divConcerned").addClass("nofollow").removeClass("divConcerned").attr("onclick", "FollowProject('" + frid + "','" + lname + "','" + fcount + "','" + uid + "','" + uname + "')").html("关注");
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".PLPicTitle").attr("onclick", "showinfo('" + frid + "','0','','" + uid + "','" + uname + "');");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}