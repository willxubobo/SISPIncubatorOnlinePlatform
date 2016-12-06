$(function () {
    GetIndustry();
    CheckUserLogin();
    var frid = getUrlParam("frid");
    if (frid != null && frid != undefined && frid != "") {
        GetInfo(frid);
    }
    SetRadioOnly();
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
                $("#ProductionName").val(result.results[0].productionName);
                $("#CompanyDescription").val(result.results[0].companyDescription);
                $("#imglogo").show();
                $("#imglogo").attr("src", result.results[0].projectLogo);
                $("#ProductionDescription").val(result.results[0].productionDescription);
                //$("#Industry").val(result.results[0].industry);
                $(document).find("input[type='checkbox']").each(function () {
                    if (result.results[0].industry.indexOf($(this).val()) != -1) {
                        $(this).prop("checked", "checked");
                    }
                });
                $("#FinancingAmount").val(result.results[0].financingAmount);
                $("#DevelopmentalStage").val(result.results[0].developmentalStage);
                $("#MarketAnalysis").val(result.results[0].marketAnalysis);
                
                $("#CoreTeam").val(result.results[0].coreTeam);
                $("#OtherInfo").val(result.results[0].otherInfo);
                if (result.results[0].permissionControl == "1") {
                    $("#PermissionControl").val("仅登陆");
                }
                else if (result.results[0].permissionControl == "2") {
                    $("#PermissionControl").val("仅投资人");
                }
                else {
                    $("#PermissionControl").val("访客");
                }
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function PostPublish() {
    if (!checkrequire()) {
        return false;
    }
    if (!checkcomlogo()) {
        return false;
    }
    var frid = getUrlParam("frid");
    var medid = $.trim($(".hidmedid").val());
    if (frid == null || frid == undefined || frid == "") {
        var localid = $.trim($(".hidlocalid").val());
        if (localid == "") {
            $("#comlogo").show();
            return false;
        } else {
            $("#comlogo").hide();
        }
        frid = "";
        if (medid == "") {
            $(this).alert("图片未上传成功无法提交！");
            return false;
        }
    }
    var industry = "";
    $(document).find("input[type='checkbox']").each(function () {
        if ($(this).prop("checked") == true) {
            industry += $(this).val() + ",";
        }
    });
    if (industry == "") {
        $(".industry").show();
        return false;
    } else {
        $(".industry").hide();
        industry = industry.substr(0, industry.length - 1);
    }
    ShowLoading();
    var fname = guid();
    var productionName = $.trim($("#ProductionName").val());
    var companyDescription = $.trim($("#CompanyDescription").val());
    var productionDescription = $.trim($("#ProductionDescription").val());
    //var industry = $.trim($("#Industry").val());
    var financingAmount = $.trim($("#FinancingAmount").val());
    var developmentalStage = $.trim($("#DevelopmentalStage").val());
    var marketAnalysis = $.trim($("#MarketAnalysis").val());
    var otherInfo = $.trim($("#OtherInfo").val());
    var coreTeam = $.trim($("#CoreTeam").val());         
    var permissionControl = GetPermissionControl();

    var frPublish = {
        FRID: frid,
        ProductionName:productionName,
        CompanyDescription: companyDescription,
        CompanyLogo:"",
        ProductionDescription: productionDescription,
        Industry: industry,
        FinancingAmount: financingAmount,
        DevelopmentalStage: developmentalStage,
        MarketAnalysis: marketAnalysis,
        OtherInfo: otherInfo,
        CoreTeam: coreTeam,
        PermissionControl: permissionControl
    };
    var weixin = {
        SavePath: "FinancingFolder",
        MediaID: medid,
        FileName: fname
    };
    var formObj = {
        "FinancingRequirements": frPublish,
        "WeiXinRequest": weixin
    };
    var parameter = {
        requestUri: "/api/financingrequirement",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    var submiturl = "/api/proxy/put";
    if (frid == null || frid == undefined || frid == "") {
        submiturl = "/api/proxy/post";
    }
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function (result) {
            gotosuccesspage();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//取消
function Cancel() {
   window.location.href = "financingprojectlist.html";
}
//获取行业分类信息
function GetIndustry() {
    var formObj = {
        "Key": "Industry"
    };
    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);

    $.ajax({
        type: "post",
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (data) {
            var results = data.results;
            if (results != null && results != undefined && results.length > 0) {
                var htmlItem = "";
                for (var i = 0; i < results.length; i++) {
                    htmlItem += "<input class=\"check-ipt\" onclick=\"hideindustrytip();\" type=\"checkbox\" value=\"" + results[i].id + "\"/>" + results[i].value + "<br/>";
                }
                htmlItem += "<div class=\"failInfo hide industry\">所属行业不能为空！</div>";
                $("#tdindustry").html(htmlItem);
            }
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
function hideindustrytip() {
    $(".industry").hide();
}
//获取权限限制
function GetPermissionControl() {
    var item = $(":radio:checked");
    var permission = item.val();

    return permission;
}
//权限控制单选
function SetRadioOnly() {
    $("#VistorRadio").click(function () {
        $("#LoginRadio").removeAttr("checked");
        $("#InvestorRadio").removeAttr("checked");
        $("#VistorRadio").attr("checked", "checked");
    });
    $("#LoginRadio").click(function () {
        $("#LoginRadio").attr("checked", "checked");
        $("#VistorRadio").removeAttr("checked");
        $("#InvestorRadio").removeAttr("checked");

    });
    $("#InvestorRadio").click(function () {
        $("#InvestorRadio").attr("checked", "checked");
        $("#LoginRadio").removeAttr("checked");
        $("#VistorRadio").removeAttr("checked");

    });
}