
$(function () {
    initinvestorinfodata();
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
                var pName = result.results[0].companyName;
                if (pName.length > 14) {
                    pName = pName.substr(0, 14) + "...";
                }
                $("#CompanyName").html(pName).attr("title", result.results[0].companyName);
                var iName = result.results[0].investmentField;
                if (iName.length > 14) {
                    iName = iName.substr(0, 14) + "...";
                }
                $("#InvestmentField").html(iName).attr("title", result.results[0].investmentField);;
                $("#investorcomlogo").show();
                $("#investorcomlogo").attr("src", result.results[0].companyLogo);
                $("#FundScale").html(result.results[0].fundScale);
                $("#InvestorName").html(result.results[0].investorName);
                var eName = result.results[0].email;
                if (eName.length > 14) {
                    eName = eName.substr(0, 14) + "...";
                }
                if (eName != "nodata") {
                    $(".showemail").show();
                    $("#Email").html("<a class='mailtoEmail' href=\"mailto:" + result.results[0].email + "\" title=\"" + result.results[0].email + "\">" + eName + "</a>");
                } else {
                    $(".showemail").show();
                    $("#Email").html("登录后可见");
                }
                $("#InvestmentStage").html(result.results[0].investmentStageName);
                var addName = result.results[0].address;
                if (addName.length > 14) {
                    addName = addName.substr(0, 14) + "...";
                }
                $("#Address").html(addName).attr("title", result.results[0].address);
                $("#InvestmentCase").html(result.results[0].investmentCase);
                $(".sessionBtn").attr("onclick", "OpenSendMsgDialog('" + frid + "','" + uname + "')");
                var isf = getUrlParam("isf");
                if (isf != null && isf != undefined && isf == "1") { //已关注
                    $(".attentionBtn").addClass("divConcerned").removeClass("attentionBtn").html("已关注").attr("onclick", "UnFollowProject('" + fid + "')");
                } else {
                    $(".attentionBtn").attr("onclick", "FollowProject()");
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

function initinvestorinfodata() {
    ShowLoading();
    var frid = getUrlParam("id");
    var fid = getUrlParam("fid");
    var type = getUrlParam("type");
    var mytype = getUrlParam("mytype");
    if (frid != null && frid != undefined && frid != "") {
        $(".hidfrid").val(frid);
        if (type != undefined && type != null && type == "detail") {
            $(".newsOperateBox").hide();
            $(".agreenBtnBox").show();
        }
        if (mytype != undefined && mytype != null && mytype == "my") {
            $(".attentiondiv").hide();
            $(".sessiondiv").removeClass("right");
        }
        GetInfo(frid, fid);
    }
}