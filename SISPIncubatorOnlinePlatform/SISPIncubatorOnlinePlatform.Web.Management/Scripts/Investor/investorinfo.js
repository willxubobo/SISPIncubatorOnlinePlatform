
$(function () {
    ShowLoading();
    var frid = getUrlParam("id");
    var fid = getUrlParam("fid");
    var type = getUrlParam("type");
    if (frid != null && frid != undefined && frid != "") {
        $(".hidfrid").val(frid);
        if (type != undefined && type != null && type == "detail") {
            $(".newsOperateBox").hide();
            $(".agreenBtnBox").show();
        }
        if (type != undefined && type != null && type == "pending") {
            $(".onelevel").html("投资人身份审核");
        }
        GetInfo(frid, fid);
        if ($("#trApproveHistory").length > 0) {
            GetApproveRecord(frid);
        }
    }
});
//根据frid获取信息
function GetInfo(frid, fid) {
    var uname = getUrlParam("uname");
    var parameter = {
        "requestUri": "/api/investorinformation/" + frid,
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
                $("#CompanyName").html(result.results[0].companyName);
                $("#InvestmentField").html(result.results[0].investmentField);
                $("#imglogo").show();
                $("#imglogo").attr("src", result.results[0].companyLogo);
                $("#FundScale").html(result.results[0].fundScale);
                $("#InvestorName").html(result.results[0].investorName);
                $("#Email").html("<a class='mailtoEmail' href=\"mailto:" + result.results[0].email + "\">" + result.results[0].email + "</a>");
                $("#InvestmentStage").html(result.results[0].investmentStageName);
                $("#Address").html(result.results[0].address);
                $("#InvestmentCase").html(ProcessWrap(result.results[0].investmentCase));
                $(".sessionBtn").attr("onclick", "OpenSendMsgDialog('" + frid + "','" + uname + "')");
                var isf = getUrlParam("isf");
                if (isf != null && isf != undefined && isf == "1") { //已关注
                    $(".attentionBtn").addClass("divConcerned").removeClass("attentionBtn").html("已关注").attr("onclick", "UnFollowProject('" + fid + "')");
                } else {
                    $(".attentionBtn").attr("onclick", "FollowProject()");
                }
                $("#IsIndexShow").html("否");
                if (result.results[0].isShow == true) {
                    $("#IsIndexShow").html("是");
                }
                
                HideLoading();
            }
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
            $(".attentionBtn").addClass("divConcerned").removeClass("attentionBtn").html("已关注").attr("onclick", "UnFollowProject('" + result + "')");
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
            $(".divConcerned").addClass("attentionBtn").removeClass("divConcerned").html("关注").attr("onclick", "FollowProject()");
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

//获取审批记录
function GetApproveRecord(frid) {
    var parameter = {
        "requestUri": "/api/approverecord/approveinfo",
        "requestParameters": {
            ApproveRelateID: frid
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
                    html += "    <li>投资人资格申请</li>";
                    html += "   <li><span>结果：</span><span>" + result + "</span></li>";
                    html += " <li><span>" + mantitle + "：</span><span>" + approveHistory[i].approverUser + "<span></span></span></li>";
                    html += "                   <li><span>时间：</span><span>" + approveHistory[i].created.substr(0, 10) + "<span></span></span></li>";
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
    var id = getUrlParam("id");
    var formObj = {
        ApproveRelateID: id,
        ApplyType: "InvestorApply",
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
                window.opener.InitGetinvestorData();
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