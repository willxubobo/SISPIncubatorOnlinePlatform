//加载投资机构
function GetInvestData() {
    var searchObj = {
        PageSize: "10"
    }
    var parameter = {
        requestUri: "/api/investorinformations/pc",
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
               if (results != null && results != undefined && results.length > 0) {
                   //$("#divNodata").hide();
                   GetInvestHtml(results);
               } else {
                   //$('#ul_InvestDep').empty();
                   //$("#divNodata").show();
               }
               //投资机构轮换
               $(".div_InvestDepScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
function GetInvestHtml(data) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        var isf = 0;
        if (data[i].isFollowed) {
            isf = 1;
        } 
        var pname = data[i].companyName;
        if (pname.length > 12) {
            pname = pname.substr(0, 12) + "...";
        }
        var iname = data[i].investmentField;
        if (iname.length > 12) {
            iname = iname.substr(0, 12) + "...";
        }
        htmlItem += "<li class=\"liinvestor" + i + "\"><div class=\"div_circleBorder1\" style=\"cursor:pointer;\" onclick=\"showinfoinvestor('" + data[i].userID + "','" + isf + "','" + data[i].followID + "','" + data[i].userName + "');\"></div><img class=\"PLPicTitle\" src=\"" + data[i].companyLogo + "\" /><div class=\"div_InvestDepTitle\" title=\""+data[i].companyName+"\">" + pname + "</div><div class=\"div_InvestDepField\" title=\""+ data[i].investmentField+"\">投资领域：" +iname + "</div>";
        htmlItem += "<div class=\"div_InvestDepAttention\"><span>关注数 :</span><span class=\"FollowC\">" + data[i].followCount + "</span><span>次</span></div><div class=\"div_InvestDep_Action\">";
        if (isf == 1) {
            htmlItem += "<div class=\"divConcerned follow\" onclick=\"InhomeUnFollowProject('" + data[i].userID + "','" + data[i].followID + "','liinvestor" + i + "','" + data[i].followCount + "','" + data[i].userName + "');return false;\">已关注</div><div style='cursor: pointer;' onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\">站内信</div>";
        } else {
            htmlItem += "<div onclick=\"InhomeFollowProject('" + data[i].userID + "','liinvestor" + i + "','" + data[i].followCount + "','" + data[i].userName + "');return false;\" class=\"nofollow\">关注</div><div style='cursor: pointer;' onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\">站内信</div>";
        }
        htmlItem += "</div></li>";
    }
    $('#ul_InvestDep').append(htmlItem);
}
//详情
function showinfoinvestor(id, isf, fid, uname) {
    window.open("Investor/investorinfo.html?id=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname));
}
//关注
function InhomeFollowProject(obj, lname, followcount,uname) {
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
            $("." + lname).find(".nofollow").addClass("divConcerned").removeClass("nofollow").attr("onclick", "UnFollowProject('" + obj + "','" + result + "','" + lname + "','" + fcount + "','" + uname + "')").html("已关注");
            $("." + lname).find(".FollowC").html(fcount);
            $("." + lname).find(".div_circleBorder1").attr("onclick", "showinfoinvestor('" + obj + "','1','" + result + "','" + uname + "');");
            // HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
            //alert('失败！');
        }
    });
}
//取消关注
function InhomeUnFollowProject(frid, obj, lname, fcount, uname) {
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
            $("." + lname).find(".div_circleBorder1").attr("onclick", "showinfoinvestor('" + frid + "','0','','" + uname + "');");
            HideLoading();
        },
        error: function (result) {
            //alert('失败！');
            HideLoading();
            ErrorResponse(result);
        }
    });
}
$(function () {
    GetInvestData();
});