

function pagePagination(p) {
    pageNo = p;
    GetInvestData(p - 1, 0);
}

//加载投资机构
function GetInvestData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "12",
        PageNumber: pageNo-1,
        KeyWord: $.trim($("#txtkeyword").val())
    }
    var parameter = {
        requestUri: "/api/investorinformations",
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
               totalPage = data.totalPage;
               totalRecords = data.totalCount;
               if (results != null && results != undefined && results.length > 0) {
                   $("#divNodata").hide();
                   GetInvestHtml(results, type);
                   pageinit(totalRecords, "12", "div_pager");
               } else {
                   $('#ul_InvestDep').empty();
                   $("#divNodata").show();
                   pageinit(0, "12", "div_pager");
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
function GetInvestHtml(data,type) {
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
        htmlItem += "<div class=\"div_circleBorder1\" onclick=\"showinfo('" + data[i].userID + "','" + isf + "','" + data[i].followID + "','" + data[i].userName + "');\" style=\"cursor: pointer;\"></div>";
        if (i == 0) {
            htmlItem += "<img class=\"PLPicTitle div_circleContentImg\" src=\"" + data[i].companyLogo + "\" />";
        } else {
            htmlItem += "<img class=\"PLPicTitle\" src=\"" + data[i].companyLogo + "\"/>";
        }
        var pname = data[i].companyName;
        if (pname.length > 12) {
            pname = pname.substr(0, 12) + "...";
        }
        var iname = data[i].investmentField;
        if (iname.length > 12) {
            iname = iname.substr(0, 12) + "...";
        }
        htmlItem += "<div class=\"div_InvestDepTitle\">" + pname + "</div><div class=\"div_InvestDepField\" title=\"" + data[i].investmentField + "\">投资领域：" + iname + "</div>";
        htmlItem += "<div class=\"div_InvestDepAttention\"><span>关注数 :</span><span class=\"FollowC\">" + data[i].followCount + "</span><span>次</span></div><div class=\"div_InvestDep_Action\">";
        if (isf == 1) {
            htmlItem += "<div class=\"divConcerned follow\" onclick=\"UnFollowProject('" + data[i].userID + "','" + data[i].followID + "','li" + i + "','" + data[i].followCount + "','" + data[i].userName + "');return false;\">已关注</div><div style='cursor: pointer;' onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\">站内信</div>";
        } else {
            htmlItem += "<div onclick=\"FollowProject('" + data[i].userID + "','li" + i + "','" + data[i].followCount + "','" + data[i].userName + "');return false;\" class=\"nofollow\">关注</div><div style='cursor: pointer;' onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\">站内信</div>";
        }
        htmlItem += "</div></li>";
    }
    $('#ul_InvestDep').empty();
    $('#ul_InvestDep').append(htmlItem);
}
//详情
function showinfo(id, isf, fid, uname) {
   window.open("investorinfo.html?id=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname));
}
//关注
function FollowProject(obj, lname, followcount,uname) {
    ShowLoading();
    var frPublish = {
        FRID: obj,
        FollowType: "1"
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
            $("." + lname).find(".nofollow").addClass("divConcerned").removeClass("nofollow").attr("onclick", "UnFollowProject('" + obj + "','" + result + "','" + lname + "','" + fcount + "','"+uname+"')").html("已关注");
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".div_circleBorder1").attr("onclick", "showinfo('" + obj + "','1','" + result + "','" + uname + "');");
             HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//取消关注
function UnFollowProject(frid, obj, lname, fcount,uname) {
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
            $("." + lname).find(".divConcerned").addClass("nofollow").removeClass("divConcerned").attr("onclick", "FollowProject('" + frid + "','" + lname + "','" + fcount + "','" + uname + "')").html("关注");
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".div_circleBorder1").attr("onclick", "showinfo('" + frid + "','0','','" + uname + "');");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
$(function () {
    pagePagination(1);
    GetInvestorAdvertisement();
    $("#investerdiv").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            pagePagination(1);
        }
    });
});

function GetInvestorAdvertisement() {
    ///Type:home(首页),investment(投资机构),cooperation(业务合作),financing(融资项目),
    var ps = 100000;
    var searchObj = {
        PageSize: ps,
        PageNumber: 1,
        KeyWord: "",
        Type: "investment"
    }
    var parameter = {
        requestUri: "/api/advertisements",
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
               if (results) {
                   GetInvestorAdvertisementHtml(results);
               }
               //InitPlug();
               $(".div_InvestDepScroll").hover(function () { jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.2) }, function () { jQuery(this).find(".prev,.next").fadeOut() });
               $(".div_InvestDepScroll").slide({ mainCell: ".bd ul", effect: "fold", delayTime: 300, autoPlay: true });
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}

//获取我的孵化器列表的html
function GetInvestorAdvertisementHtml(data) {
    var htmlItem = "";
    var htmlsmallItem = "";
    for (i = 0; i < data.length; i++) {

        var url = data[i].url;
        if (data[i].picture != "") {
            url = data[i].picture;
        }

        if ($.trim(url) != "") {
            htmlItem += "<li><a href=\"javascript:\" style='cursor: pointer' onclick=\"ShowInfo('" + data[i].url + "','" + data[i].adid + "')\"><img src=\"" + url + "\" /></a></li>";
            htmlsmallItem += "<li><img src=\"" + url + "\" /></li>";
        } else {
            htmlItem += "<li><a href=\"javascript:\" style='cursor: pointer' onclick=\"ShowInfo('" + data[i].url + "','" + data[i].adid + "')\"><img src=\"../images/pc/banner1.jpg\" /></a></li>";
            htmlsmallItem += "<li><img src=\"../images/pc/banner1.jpg\" /></li>";
        }
    }
    if ($.trim(htmlItem) != "") {
        $("#bigimg").html(htmlItem);
        $("#smallimg").html(htmlsmallItem);
    } else {
        $("#bigimg").html("<li><a  target=\"_blank\"><img src=\"../images/pc/banner1.jpg\" /></a></li>");
        $("#smallimg").html("<li><img src=\"../images/pc/banner1.jpg\" /></li>");
    }

}