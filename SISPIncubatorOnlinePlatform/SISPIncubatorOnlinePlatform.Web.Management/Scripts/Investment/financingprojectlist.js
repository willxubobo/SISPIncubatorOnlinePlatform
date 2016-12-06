function pagePagination(p) {
    pageNo = p;
    GetInvestData(p - 1, 0);
}

//加载投资机构
function GetInvestData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo-1,
        KeyWord: $.trim($("#txtkeyword").val())
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
               var results = data.results;
               //totalPage = data.totalPage;
               totalRecords = data.totalCount;
               if (results != null && results != undefined && results.length > 0) {
                   $("#divNodata").hide();
                   GetInvestHtml(results, type);
                   pageinit(totalRecords, "10", "div_pager");
               } else {
                   $('#ul_InvestDep').empty();
                   $("#divNodata").show();
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
function GetInvestHtml(data, type) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        var isf = 0;
        if (data[i].isFollowed) {
            isf = 1;
        }
        if (i % 3 == 0) {
            htmlItem += "<li class=\"in_liFirst li" + i + "\">";
        } else {
            htmlItem += "<li class=\"li" + i + "\">";
        }
        htmlItem += "<div class=\"div_circleBorder1\" onclick=\"showinfo('" + data[i].frid + "','" + isf + "','" + data[i].followID + "','" + data[i].userID + "','" + data[i].userName + "');\" style=\"cursor: pointer;\"></div>";
        if (i == 0) {
            htmlItem += "<img class=\"PLPicTitle div_circleContentImg\" src=\"" + data[i].projectLogo + "\" />";
        } else {
            htmlItem += "<img class=\"PLPicTitle\" src=\"" + data[i].projectLogo + "\"/>";
        }
        var pname = data[i].productionName;
        if (pname.length > 12) {
            pname = pname.substr(0, 12) + "...";
        }
        htmlItem += "<div class=\"div_InvestDepTitle\">" + pname + "</div><div class=\"div_InvestDepField\">所属行业：" + data[i].industry + "</div>";
        htmlItem += "<div class=\"div_InvestDepAttention\"><span>关注数 :</span><span class=\"FollowC\">" + data[i].followCount + "</span><span>次</span></div><div class=\"div_InvestDep_Action\">";
        if (isf == 1) {
            htmlItem += "<div class=\"divConcerned follow\" onclick=\"UnFollowProject('" + data[i].frid + "','" + data[i].followID + "','li" + i + "','" + data[i].followCount + "');return false;\">已关注</div><div>站内信</div>";
        } else {
            htmlItem += "<div onclick=\"FollowProject('" + data[i].frid + "','li" + i + "','" + data[i].followCount + "');return false;\"  class=\"nofollow\">关注</div><div>站内信</div>";
        }
        htmlItem += "</div></li>";
    }
    $('#ul_InvestDep').empty();
    $('#ul_InvestDep').append(htmlItem);
}
//详情
function showinfo(id, isf, fid, uid, uname) {
   window.open("financingprojectinfo.html?frid=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname) + "&uid=" + uid);
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
        FollowType: "0"
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
            $("." + lname).find(".nofollow").addClass("divConcerned").removeClass("nofollow").attr("onclick", "UnFollowProject('" + obj + "','" + result + "','" + lname + "','" + fcount + "')").html("已关注");;
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".PLPicTitle").attr("onclick", "showinfo('" + obj + "','1','" + result + "');");
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
            $("." + lname).find(".divConcerned").addClass("nofollow").removeClass("divConcerned").attr("onclick", "FollowProject('" + frid + "','" + lname + "','" + fcount + "')").html("关注");;
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".PLPicTitle").attr("onclick", "showinfo('" + frid + "','0','');");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
$(function () {
    GetInvestData(pageNo-1, 0);
});