function initfinancingprojectdetail() {
    ShowLoading();
    var ctype = getUrlParam("type");
    if (ctype != null && ctype != undefined && ctype == "pending") {
        $(".onelevel").html("融资需求发布审核");
    }
    var frid = getUrlParam("frid");
    if (frid != null && frid != undefined && frid != "") {
        $(".hidfrid").val(frid);
        GetInfo(frid);
        if ($("#trApproveHistory").length > 0) {
            GetApproveRecord(frid);
        }
    } else {
        HideLoading();
    }
}
$(function () {
    initfinancingprojectdetail();
    
});
//根据frid获取信息
function GetInfo(frid) {
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
        url: "/api/proxy/get",
        data: parameterJson,
        success: function (result) {
            if (result != null && result != undefined && result.results.length > 0) {
                $("#ProductionName").html(result.results[0].productionName);
                $("#CompanyDescription").html(ProcessWrap(result.results[0].companyDescription));
                $("#financingdetailcomlogo").show();
                $("#financingdetailcomlogo").attr("src", result.results[0].projectLogo);
                $("#ProductionDescription").html(ProcessWrap(result.results[0].productionDescription));
                $("#Industry").html(result.results[0].industryName);
                $("#FinancingAmount").html(result.results[0].financingAmount+"万元");
                $("#DevelopmentalStage").html(ProcessWrap(result.results[0].developmentalStage));
                $("#MarketAnalysis").html(ProcessWrap(result.results[0].marketAnalysis));
                $("#CoreTeam").html(ProcessWrap(result.results[0].coreTeam));
                $("#OtherInfo").html(ProcessWrap(result.results[0].otherInfo));
                $("#IsIndexShow").html("否");
                if (result.results[0].isShow == true) {
                    $("#IsIndexShow").html("是");
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
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//获取审批记录
function GetApproveRecord(frid) {
    var parameter = {
        "requestUri": "/api/approverecord/approveinfo",
        "requestParameters": {
            ApproveRelateID:frid
        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (obj) {
            if (obj != null && obj != undefined && obj.results.length > 0) {
                var approveHistory = obj.results;
                var html = "";
                for (var i = 0; i < approveHistory.length; i++) {
                    var mantitle = "审核人";
                    var node = "提交申请";
                    var result = "提交申请";
                    if (approveHistory[i].approveResult == null || approveHistory[i].approveResult == "0") {
                        node = "提交申请";
                        result = "提交申请";
                        mantitle = "申请人";
                    } else if (approveHistory[i].approveResult == "2") {
                        node = "管理员审批";
                        result = "审核通过";
                    }
                    else if (approveHistory[i].approveResult == "3") {
                        node = "管理员审批";
                        result = "审核驳回";
                    }
                    else if (approveHistory[i].approveResult == "4") {
                        node = "申请人操作";
                        result = "撤销申请";
                    }
                    html += "<tr>";
                    html += "<td colspan=\"4\" class=\"tdApproveResult\">";
                    html += " <p>" + node + "</p>";
                    html += " <ul>";
                    html += "    <li>融资项目申请</li>";
                    html += "   <li><span>结果：</span><span>" + result + "</span></li>";
                    html += " <li><span>"+mantitle+"：</span><span>" + approveHistory[i].approverUser + "<span></span></span></li>";
                    html += "                   <li><span>时间：</span><span>" + approveHistory[i].created.substr(0,10) + "<span></span></span></li>";
                    html += "                </ul>";
                    html += "            </td>";
                    html += "        </tr>";
                }
                $("#trApproveHistory").after(html);

            }
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//通过或者拒绝
function UpdateApprove(approveStatus) {
    var comments = $("#txtComments").val();
    if ($.trim(comments) == "") {
        $("#txtComments").next().show();
        return;
    } else {
        $("#txtComments").next().hide();
    }
    ShowLoading();
    var id = getUrlParam("frid");
    var formObj = {
        ApproveRelateID: id,
        ApplyType: "FinancingApply",
        Comments: comments,
        ApproveStatus: approveStatus
    };

    var parameter = {
        requestUri: "/api/approverecord/approve",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert('审批成功');
            setTimeout(function () {
                window.opener.InitGetFinancingProjectData();
                window.close();
            }, 2000);
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
            HideLoading();
        }
    });
}
