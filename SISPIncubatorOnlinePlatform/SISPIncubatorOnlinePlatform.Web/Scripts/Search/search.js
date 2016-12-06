$(function () {
    //if (CheckUserLogin())return;
    InitFormData();

});
function InitFormData() {
    ShowLoading();
    var keyWord = getUrlParam("keyword");
    $("#txtCondition").val(keyWord);
    GetInvestorInformation();
    GetFinancingRequirements();
    GetServicePublishs();
    GetDemandPublishs();

    InitTopFlag();

    $("#txtCondition").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            GlobalSearch();
        }
    });
}

//初始化滑倒最上部
function InitTopFlag() {
    $(".divTopFlag").hide();
    var rightMargin = $(".search_resultDiv_Content").css("margin-right");
    var rightNum = parseFloat(rightMargin);
    var rightPositionNum = rightNum - 30 - 54;

    $(".divTopFlag").css("right", rightPositionNum);

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 100) {
            $('.divTopFlag').fadeIn(300);
        } else {
            $('.divTopFlag').fadeOut(300);
        }
    });
    $('.divTopFlag').click(function () {
        $('html,body').animate({ scrollTop: '0px' }, 800);
    });
}
//获取投资机构数据
function GetInvestorInformation() {
    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: $("#txtCondition").val()
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/search/investors",
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
               GetInvestorsHtml(results);
               totalRecords = data.totalCount;
               $("#spanNum1").text(totalRecords);
               pageinit(data.totalCount, ps, "div_pager1");
               if (totalRecords <= 0) {
                   $("#divNodata1").show();
               } else {
                   $("#divNodata1").hide();
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

//获取投资机构html
function GetInvestorsHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var isf = 0;
        html += "<tr>";
        html += "<td rowspan=\"3\" style='width:175px;' class=\"tdImg\">";
        html += "  <img src=\"" + data[i].companyLogo + "\">";
        html += "</td>";
        var tmp = "";
        if ($.trim(data[i].followID) != "") {
            isf = 1;
            tmp = "   <div style='cursor: pointer;' class='divItem_action divConcerned' onclick=\"UnFollowProject(this,'" + data[i].userID + "','" + data[i].followID + "','span0" + i + "','" + data[i].followCount + "')\">已关注</div>";
        } else {
            tmp = "   <div style='cursor: pointer;' onclick=\"FollowProject(this,'" + data[i].userID + "','span0" + i + "','" + data[i].followCount + "','1')\">关注</div>";
        }
        html += " <td colspan=\"2\" class=\"tdCompanyTitle\"><a href='#' onclick=\"ShowInfo1('" + data[i].userID + "','" + isf + "','" + data[i].followID + "','" + data[i].userName + "')\" class='aCompanyTitle'>" + data[i].companyName + "</a></td>";
        html += " <td rowspan=\"3\" style='width:172px;' class=\"tdBtnAction\">";
        html += tmp;
        html += "   <div style='cursor: pointer;' onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\">站内信</div>";
        html += " </td>";
        html += "</tr>";
        html += " <tr>";
        html += "    <td colspan=\"2\" class=\"tdCompanyContent\">";
        html += "<a href='#' onclick=\"ShowInfo1('" + data[i].userID + "','" + isf + "','" + data[i].followID + "','" + data[i].userName + "' )\" title='" + data[i].investmentCase + "' class='aCompanyContent'>" + (data[i].investmentCase.length >= 160 ? data[i].investmentCase.substring(0, 160) + "..." : data[i].investmentCase) + "</a>";
        html += "    </td>";
        html += " </tr>";
        html += " <tr class=\"trBorderBottom\">";
        html += "     <td class=\"tdIndustry\" style='width:320px;'>"
        html += "         <span>投资领域：</span><span title='" + data[i].investmentField + "'>" + (data[i].investmentField.length>=16?data[i].investmentField.substring(0,16)+"...": data[i].investmentField)+ "</span>";
        html += "     </td>";
        html += "    <td class=\"tdBtnAction2\">";
        html += "        <span>关注数：</span><span class='span0" + i + "'>" + data[i].followCount + "</span><span>次</span>";
        html += "    </td>";
        html += "  </tr>";
    }
    if ($.trim(html) != "") {
        $("#tabInvestor").html(html);
    }
}

//融资项目数据
function GetFinancingRequirements() {
    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: $("#txtCondition").val()
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/search/financingrequirements",
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
               GetFinancingRequirementsHtml(results);

               totalRecords = data.totalCount;
               $("#spanNum2").text(totalRecords);
               pageinit(data.totalCount, ps, "div_pager2");
               if (totalRecords <= 0) {
                   $("#divNodata2").show();
               } else {
                   $("#divNodata2").hide();
               }
               // HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

//获取投资机构html
function GetFinancingRequirementsHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var isf = 0;
        html += "<tr>";
        html += "<td rowspan=\"3\" style='width:175px;' class=\"tdImg\">";
        html += "  <img src=\"" + data[i].projectLogo + "\">";
        html += "</td>";
        var tmp = "";
        if ($.trim(data[i].followID) != "") {
            isf = 1;
            tmp = "   <div style='cursor: pointer;' class='divItem_action divConcerned' onclick=\"UnFollowProject(this,'" + data[i].frid + "','" + data[i].followID + "','span1" + i + "','" + data[i].followCount + "')\">已关注</div>";
        } else {
            tmp = "   <div style='cursor: pointer;' onclick=\"FollowProject(this,'" + data[i].frid + "','span1" + i + "','" + data[i].followCount + "','0')\">关注</div>";
        }
        html += " <td colspan=\"2\" class=\"tdCompanyTitle\"><a href='#' onclick=\"ShowInfo2('" + data[i].frid + "','" + isf + "','" + data[i].followID + "','" + data[i].userID + "','" + data[i].userName + "');\" title='" + data[i].productionName + "' class='aCompanyTitle'>" + (data[i].productionName.length >= 160 ? data[i].productionName.substring(0, 160) + "..." : data[i].productionName) + "</a></td>";
        html += " <td rowspan=\"3\" style='width:172px;' class=\"tdBtnAction\">";
        html += tmp;
        html += "   <div style='cursor: pointer;' onclick=\"OpenSendMsgDialog('" + data[i].userID + "','" + data[i].userName + "')\">站内信</div>";
        html += " </td>";
        html += "</tr>";
        html += " <tr>";
        html += "    <td colspan=\"2\" class=\"tdCompanyContent\">";
        html += "<a href='#' onclick=\"ShowInfo2('" + data[i].frid + "','" + isf + "','" + data[i].followID + "','" + data[i].userID + "','" + data[i].userName + "');\" class='aCompanyContent' title='" + data[i].productionDescription + "' >" + (data[i].productionDescription.length >= 160 ? data[i].productionDescription.substring(0, 160) + "..." : data[i].productionDescription) + "</a>";
        html += "    </td>";
        html += " </tr>";
        html += " <tr class=\"trBorderBottom\">";
        html += "     <td class=\"tdIndustry\" style='width:auto;'>"
        html += "         <span>所属行业：</span><span title='" + data[i].industryName + "'>" + (data[i].industryName.length >= 20 ? data[i].industryName.substring(0, 20) + "..." : data[i].industryName) + "</span>";
        html += "     </td>";
        html += "    <td class=\"tdBtnAction2\">";
        html += "        <span>关注数：</span><span class='span1" + i + "'>" + data[i].followCount + "</span><span>次</span>";
        html += "    </td>";
        html += "  </tr>";
    }
    if ($.trim(html) != "") {
        $("#tabFinancingRequirements").html(html);
    }
}

//获取服务数据
function GetServicePublishs() {
    $("#tabServicesPubilshs").empty();
    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: $("#txtCondition").val()
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/search/servicepublishs",
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
               GetServicesPublishsHtml(results);

               totalRecords = data.totalCount;
               $("#spanNum3").text(totalRecords);
               pageinit(data.totalCount, ps, "divpager3");
               if (totalRecords <= 0) {
                   $("#divNodata3").show();
               } else {
                   $("#divNodata3").hide();
               }
               //HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//获取服务发布html
function GetServicesPublishsHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html = "";
        html += "<tr>";
        html += "<td rowspan=\"2\" class=\"tdImg\">";
        html += "	<img src=\"" + data[i].imgUrl + "\">";
        html += "	</td>";
        html += "	<td colspan=\"4\" class=\"tdCompanyTitle\"><a href='#' onclick=\"ShowInfo3('" + data[i].serviceID + "')\" class='aCompanyTitle'>" + data[i].companyName + "</a></td>";
        html += "	</tr>";
        html += "	<tr>";
        html += "		<td colspan=\"4\" class=\"tdCompanyContent\"><a href='#' onclick=\"ShowInfo3('" + data[i].serviceID + "')\" class='aCompanyContent'>";
        html += data[i].description;
        html += "		</a></td>";
        html += "		</tr>";
        html += "		<tr class=\"trBorderBottom\">";
        html += "			<td class=\"lastTd\"></td>";
        html += "			<td>所属行业：<span>" + data[i].industryName + "</span></td>";
        html += "			<td>所属类别：<span>" + data[i].category + "</span></td>";
        html += "			<td>联系电话：<span class=\"\">" + data[i].phoneNumber + "</span></td>";
        html += "			<td>邮箱：<a href=\"mailto:" + data[i].email + "\"><span class=\"spanFlag\">" + data[i].email + "</span></a></td>";
        html += "		</tr>";
        $("#tabServicesPubilshs").append(html);
    }
}
//获取需求服务数据
function GetDemandPublishs() {
    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: $("#txtCondition").val()
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/search/demandpublishs",
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
               GetDemandPublishsHtml(results);

               totalRecords = data.totalCount;
               $("#spanNum4").text(totalRecords);
               pageinit(data.totalCount, ps, "divpager4");
               if (totalRecords <= 0) {
                   $("#divNodata4").show();
               } else {
                   $("#divNodata4").hide();
               }
               //HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

//获取需求服务发布html
function GetDemandPublishsHtml(data) {
    var html = "";
    $("#tabDemandPubilshs").empty();
    for (var i = 0; i < data.length; i++) {
        html = "";
        html += "<tr>";
        html += "<td rowspan=\"2\" class=\"tdImg\">";
        html += "	<img src=\"" + data[i].imgUrl + "\">";
        html += "	</td>";
        html += "	<td colspan=\"4\"  class=\"tdCompanyTitle\"><a href='#' onclick=\"ShowInfo4('" + data[i].demandID + "')\" class='aCompanyTitle'>" + data[i].companyName + "</a></td>";
        html += "	</tr>";
        html += "	<tr>";
        html += "		<td colspan=\"4\" class=\"tdCompanyContent\"><a onclick=\"ShowInfo4('" + data[i].demandID + "')\" href='#' class='aCompanyContent'>";
        html += data[i].projectDescription;
        html += "		</a></td>";
        html += "		</tr>";
        html += "		<tr class=\"trBorderBottom\">";
        html += "			<td class=\"lastTd\"></td>";
        html += "			<td>联系电话：<span >" + data[i].mobile + "</span></td>";
        html += "			<td>邮箱：<a href=\"mailto:" + data[i].email + "\"><span class=\"spanFlag\">" + data[i].email + "</span></a></td>";
        html += "			<td>所属类别：<span>"+data[i].category+"</span></td>";
        html += "			<td></td>";
        html += "		</tr>";
        $("#tabDemandPubilshs").append(html);
    }
    //if ($.trim(html) != "") {
    //    $("#tabDemandPubilshs").html(html);
    //}
}
//点击分页
function pagePagination(p) {
    pageNo = p;
    var id = $(".litab.selected")[0].id;
    if (id == "0") {
        GetInvestorInformation();
    } else if (id == "1") {
        GetFinancingRequirements();
    }
    else if (id == "2") {
        GetServicePublishs();
    }
    else if (id == "3") {
        GetDemandPublishs();
    }
    InitTopFlag();
}
//切换类型
function SwitchTap(obj) {
    $(obj).parent().find(".litab").removeClass("selected");
    $(obj).addClass("selected");
    $("div[class*='part']").hide();
    var id = $(obj).attr("id");
    pageNo = 1;
    if (id == "0") {
        GetInvestorInformation();
    } else if (id == "1") {
        GetFinancingRequirements();
    }
    else if (id == "2") {
        GetServicePublishs();
    }
    else if (id == "3") {
        GetDemandPublishs();
    }
    $(".part" + id).show();
}
//查询
function GlobalSearch() {
    $($(".litab")[0]).addClass("selected");
    $("div[class*='part']").hide();
    $(".part0").show();
    pageNo = 1;
    $("#spanNum1").text("0");
    $("#spanNum2").text("0");
    $("#spanNum3").text("0");
    $("#spanNum4").text("0");

    $("#tabInvestor").empty();
    $("#tabFinancingRequirements").empty();
    $("#tabServicesPubilshs").empty();
    $("#tabDemandPubilshs").empty();

    ShowLoading();
    GetInvestorInformation();
    GetFinancingRequirements();
    GetServicePublishs();
    GetDemandPublishs();
}
//关注
function FollowProject(obj, id, lname, followcount, type) {
    var frPublish = {
        FRID: id,
        FollowType: type
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
            $("." + lname).text(fcount);
            $(obj).attr("onclick", "UnFollowProject(this,'" + id + "','" + result + "','" + lname + "','" + fcount + "')");
            $(obj).html("已关注");
            $(obj).addClass("divItem_action divConcerned");

            var onclickInfo1 = $(obj).parent().parent().find(".aCompanyTitle").attr("onclick");

            var newInfo = GetNewClickInfo(onclickInfo1, 1, result);
            if (newInfo.length > 0) {

                $(obj).parent().parent().find(".aCompanyTitle").attr("onclick",newInfo );

                $(obj).parent().parent().next().find(".aCompanyContent").attr("onclick", newInfo);
            }
        },
        error: function (result) {
            //HideLoading();
            $(this).alert('关注失败！');
            ErrorResponse(result);

        }
    });
}
//取消关注
function UnFollowProject(obj, frid, itemid, lname, fcount) {
    var formObj = {
    };
    var parameter = {
        requestUri: "/api/financingrequirementfollow/" + itemid,
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

            $("." + lname).text(fcount);
            $(obj).attr("onclick", "FollowProject(this,'" + frid + "','" + lname + "','" + fcount + "')");
            $(obj).html("关注");
            $(obj).removeClass("divItem_action divConcerned");

            var onclickInfo1 = $(obj).parent().parent().find(".aCompanyTitle").attr("onclick");

            var newInfo = GetNewClickInfo(onclickInfo1, 0,'');
            if (newInfo.length > 0) {

                $(obj).parent().parent().find(".aCompanyTitle").attr("onclick", newInfo);

                $(obj).parent().parent().next().find(".aCompanyContent").attr("onclick", newInfo);
            }
        },
        error: function (result) {
            alert('取消关注失败！');
            //HideLoading();
            ErrorResponse(result);
        }
    });
}

function ShowInfo1(id, isf, fid, uname) {
    window.open("../Investor/investorinfo.html?id=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname));
}

function ShowInfo2(id, isf, fid, uid, uname) {
    window.open("../Investment/financingprojectinfo.html?frid=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname) + "&uid=" + uid);
}

function ShowInfo4(id) {
    window.open("../cooperate/demanddetail.html?id=" + id);
}

function ShowInfo3(id) {
    window.open("../cooperate/servicedetail.html?id=" + id);
}

function GetNewClickInfo(info,type,fid) {
    var arry = info.split(",");
    var newshow = "";
    for (var i = 0; i < arry.length; i++) {
        if (i == 1) {
            newshow = newshow + "," + "'" + type + "'";
        }
        else if(i==2) {
            newshow = newshow + "," + "'" + fid + "'";
        }
        else {
            newshow = newshow + "," + arry[i];
        }
    }
    if (newshow.length > 0) {
        newshow = newshow.substring(1);
    }
    return newshow;
}