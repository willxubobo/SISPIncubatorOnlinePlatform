$(function () {
    ShowLoading();
    var id = getUrlParam("id");
    if (id != null && id != undefined && id != "") {
        GetData(id);
    } else {
        HideLoading();
    }
});
function GetData(id) {
    var searchObj = {
        ApproveRelateID: id
    }
    var parameter = {
        requestUri: "/api/approverecord/approveinfo",
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
               var results = data.results;
               GetHtml(results);
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
function GetHtml(data) {
    var htmlItem = "";
    if (data[0].approveResult == "2") {
        $(".auditStatic").html("审核通过");
    } else if (data[0].approveResult == "3") {
        $(".auditStatic").html("审核拒核");
    }
    var id = getUrlParam("id");
    var applytype = data[0].applyType;
    var infourl = "";
    var iurl = "";
    var strApplyType = "";
    switch (applytype) {
        case "0":
            strApplyType = "孵化器入驻申请";
            infourl = "Incubator/incubatorapply.html?rid=" + id;
            iurl = "Incubator/incubatorapplydetail.html?id=" + id;
            break;
        case "1":
            strApplyType = "办公室入驻申请";
            infourl = "Office/officesettledaapply.html?id=" + id;
            iurl = "Office/officesettledaapplydetail.html?id=" + id;
            break;
        case "2":
            strApplyType = "投资人资格申请";
            infourl = "investor/applyforainvestor.html?userid=" + id;
            iurl = "investor/investorinfo.html?id=" + id+"&type=detail";
            break;
        case "3":
            strApplyType = "融资发布申请";
            infourl = "investment/financingrequirementspublish.html?frid=" + id;
            iurl = "investment/financingprojectinfo.html?frid=" + id + "&type=detail";
            break;
        case "4":
            strApplyType = "服务发布申请";
            infourl = "cooperate/servicepublish.html?id=" + id;
            iurl = "cooperate/servicedetail.html?id=" + id;
            break;
        case "5":
            strApplyType = "需求发布申请";
            infourl = "cooperate/demandpublish.html?id=" + id;
            iurl = "cooperate/demanddetail.html?id=" + id;
            break;
        case "6":
            strApplyType = "活动发布申请";
            infourl = "activity/activitypublishapply.html?id=" + id;
            iurl = "activity/activitydetail.html?id=" + id + "&type=detail&category=0";
            break;
        case "7":
            strApplyType = "举办孵化器活动申请";
            infourl = "activity/incubatoractivityapply.html?id=" + id;
            iurl = "activity/activitydetail.html?id=" + id + "&type=detail&category=1";
            break;
        default: strApplyType = ""; break;
    }
    $(".hidurl").val(infourl);
    $(".hidinfourl").val(iurl);
    $("#ptype").html(strApplyType + " - 审核进度");
  
    for (i = 0; i < data.length; i++) {
        var approvestatus = "";
        if (applytype == "0") {
            if (data[i].approveResult == "1") {
                approvestatus = "公共孵化器审核中。";
            } else if (data[i].approveResult == "2") {
                approvestatus = "公共孵化器审核通过。";
            } else if (data[i].approveResult == "3") {
                approvestatus = "公共孵化器审核驳回。";
            } else if (data[i].approveResult == "4") {
                approvestatus = "审核通过。";
            } else if (data[i].approveResult == "5") {
                approvestatus = "品牌孵化器审核驳回。";
            } else if (data[i].approveResult == "6") {
                approvestatus = "撤销。";
            }
        }
        else {
            if (data[i].approveResult == "2") {
                approvestatus = "审核通过。";
            } else if (data[i].approveResult == "3") {
                approvestatus = "审核驳回。";
            } else if (data[i].approveResult == "4") {
                approvestatus = "撤销。";
            }
        }

        var coms = "";
        if (data[i].comments != null && data[i].comments != undefined && data[i].comments != "") {
            coms = data[i].comments;
        }
        if (i == 0) {
            if (applytype == "0") {
                if (data[i].approveResult == "6") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">申请人撤销。</p></div></div>";
                } else if (data[i].approveResult == "4") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">审核通过。" + coms + "</p></div></div>";
                } else if (data[i].approveResult == "2") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">品牌孵化器审核中。" + coms + "</p></div></div>";
                } else if (data[i].approveResult == "5") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                    htmlItem += " <div class=\"auditListTxt\">";
                    htmlItem += "<p class=\"auditTxt\">退回修改中。</p></div></div>";

                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">品牌孵化器审核驳回。" + coms + "</p></div></div>";
                } else if (data[i].approveResult == "3") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                    htmlItem += " <div class=\"auditListTxt\">";
                    htmlItem += "<p class=\"auditTxt\">退回修改中。</p></div></div>";

                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">公共孵化器审核驳回。" + coms + "</p></div></div>";
                } else if ($.trim(data[i].approveResult) == "") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                    htmlItem += " <div class=\"auditListTxt\">";
                    htmlItem += "<p class=\"auditTxt\">公共孵化器审核中。</p></div></div>";

                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">提交申请。</p></div></div>";
                }
            }
            else {
                if (data[i].approveResult == "4") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">申请人撤销。</p></div></div>";
                } else if (data[i].approveResult == "2") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">审核通过。" + coms + "</p></div></div>";
                } else if (data[i].approveResult == "3") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                    htmlItem += " <div class=\"auditListTxt\">";
                    htmlItem += "<p class=\"auditTxt\">退回修改中。</p></div></div>";

                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">审核驳回。" + coms + "</p></div></div>";
                } else if ($.trim(data[i].approveResult) == "") {
                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                    htmlItem += " <div class=\"auditListTxt\">";
                    htmlItem += "<p class=\"auditTxt\">管理员审核中。</p></div></div>";

                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                    htmlItem += "<p class=\"auditTxt\">提交申请。</p></div></div>";
                }
            }
        } else {
            if ($.trim(data[i].approveResult) == "") {
                htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                htmlItem += "<p class=\"auditTxt\">提交申请。</p></div></div>";
            } else {
                htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                htmlItem += "<p class=\"auditTxt\">" + approvestatus + "。" + coms + "</p></div></div>";
            }
        }

    }
    if (htmlItem != "") {
        $('.auditBox').append(htmlItem);
    }
}
//重新提交
function ReSubmit() {
    var url = $(".hidurl").val();
    if (url != "") {
       window.location.href = url;
    }
}
//详情
function goinfo() {
    var url = $(".hidinfourl").val();
    if (url != "") {
       window.location.href = url;
    }
}
function InitOrigin(id, applytype) {
    var result = false;
    if (applytype == "活动发布申请") {
        var parameter = {
            requestUri: "/api/activitypublishapply/" + id
        }
        var jsonData = JSON.stringify(parameter);
        $.ajax(
           {
               type: "POST",
               url: "/api/proxy/get",
               data: jsonData,
               dataType: "json",
               contentType: "application/json; charset=utf-8",
               async: false,
               success: function (data) {
                   if (data.results[0].origin == "Web") {
                       result = true;
                   }
               },
               error: function (err) {
                   ErrorResponse(err);
               }
           });
    }
    else if (applytype == "举办孵化器活动申请") {
        var parameter = {
            requestUri: "/api/incubatorActivityApply/" + id
        }
        var jsonData = JSON.stringify(parameter);
        $.ajax(
           {
               type: "POST",
               url: "/api/proxy/get",
               data: jsonData,
               dataType: "json",
               contentType: "application/json; charset=utf-8",
               async: false,
               success: function (data) {
                   if (data.results[0].origin == "Web") {
                       result = true;
                   }
               },
               error: function (err) {
                   ErrorResponse(err);
               }
           });
    }
    return result;

}