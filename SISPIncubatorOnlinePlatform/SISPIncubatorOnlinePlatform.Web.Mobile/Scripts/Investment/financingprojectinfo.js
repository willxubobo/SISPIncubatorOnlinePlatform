﻿
$(function () {
    ShowLoading();
    var frid = getUrlParam("frid");
    var fid = getUrlParam("fid");
    var type = getUrlParam("type");
    if (frid != null && frid != undefined && frid != "") {
        $(".hidfrid").val(frid);
        if (type != undefined && type != null && type == "detail") {
            $(".newsOperateBox").hide();
            $(".agreenBtnBox").show();
        }
        GetInfo(frid, fid);
    } else {
        HideLoading();
    }
});
//根据frid获取信息
function GetInfo(frid, fid) {
    var uname = getUrlParam("uname");
    var uid = getUrlParam("uid");
    var parameter = {
        "requestUri": "/api/financingrequirement/" + frid,
        "requestParameters": {

        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null && result != undefined && result.results.length > 0) {
                $("#ProductionName").html(result.results[0].productionName);
                $("#CompanyDescription").html(ProcessWrap(result.results[0].companyDescription));
                $("#imglogo").show();
                $("#imglogo").attr("src", result.results[0].projectLogo);
                $("#ProductionDescription").html(ProcessWrap(result.results[0].productionDescription));
                $("#Industry").html(result.results[0].industryName);
                $("#FinancingAmount").html(result.results[0].financingAmount);
                $("#DevelopmentalStage").html(ProcessWrap(result.results[0].developmentalStage));
                $("#MarketAnalysis").html(ProcessWrap(result.results[0].marketAnalysis));
                $(".sessionBtn").attr("onclick", "OpenSendMsgDialog('" + uid + "','" + uname + "')");
                $("#CoreTeam").html(ProcessWrap(result.results[0].coreTeam));
                $("#OtherInfo").html(ProcessWrap(result.results[0].otherInfo));
                    var isf = getUrlParam("isf");
                    if (isf != null && isf != undefined && isf == "1") { //已关注
                        $(".attentionBtn").addClass("readBtn").removeClass("attentionBtn").html("已关注").attr("onclick", "UnFollowProject('" + fid + "')");
                    } else {
                        $(".attentionBtn").attr("onclick", "FollowProject()");
                    }
                    if (result.results[0].permissionControl == "1") {
                        $("#PermissionControl").html("仅登陆");
                    }
                    else if (result.results[0].permissionControl == "2") {
                        $("#PermissionControl").html("仅投资人");
                    }
                    else {
                        $("#PermissionControl").html("访客");
                    }
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//关注
function FollowProject() {
    ShowLoading();
    var frid = $(".hidfrid").val();
    var frPublish = {
        FRID: frid,
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
            $(".attentionBtn").addClass("readBtn").removeClass("attentionBtn").html("已关注").attr("onclick", "UnFollowProject('" + result + "')");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//取消关注
function UnFollowProject(obj) {
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
            $(".readBtn").addClass("attentionBtn").removeClass("readBtn").html("关注").attr("onclick", "FollowProject()");
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}

//返回到我的申请
function returnapply() {
    var renturnUrl = getUrlParam("returnurl");
    if (renturnUrl != null && renturnUrl != undefined && $.trim(renturnUrl) != "") {
       window.location.href = decodeURI(renturnUrl);
    } else {
       window.location.href = "../myapply.html";
    }
}