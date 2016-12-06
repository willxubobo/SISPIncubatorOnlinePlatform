$(function () {
    CheckUserLogin();
    GetInvestmentStage();
    var userid = getUrlParam("userid");
    if (userid != null && userid != undefined && userid != "") {
        GetInfo(userid);
    } else {
        $("#selectBtn").mobiscroll().select({
            theme: "default",
            lang: "zh",
            mode: "scroller",
            display: "bottom",
            animate: "fade"
        });
    }
});

//根据userid获取信息
function GetInfo(userid) {
    var parameter = {
        "requestUri": "/api/investorinformation/" + userid,
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
                $("#CompanyName").val(result.results[0].companyName);
                $("#imglogo").show();
                $("#imglogo").attr("src", result.results[0].companyLogo);
                $("#FundScale").val(result.results[0].fundScale);
                $("#InvestmentField").val(result.results[0].investmentField);
                $("#InvestorName").val(result.results[0].investorName);
                $("#Email").val(result.results[0].email);
                $("#selectBtn").val(result.results[0].investmentStage);
                $("#selectBtn").mobiscroll().select({
                    theme: "default",
                    lang: "zh",
                    mode: "scroller",
                    display: "bottom",
                    animate: "fade"
                });
                $("#Address").val(result.results[0].address);
                $("#InvestmentCase").val(result.results[0].investmentCase);
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
    var medid = $.trim($(".hidmedid").val());
    var userid = getUrlParam("userid");
    if (userid == null || userid == undefined || userid == "") {
        var localid = $.trim($(".hidlocalid").val());
        if (localid == "") {
            $(".comlogo").show();
            return false;
        } else {
            $(".comlogo").hide();
        }
        if (medid == "") {
            $(this).alert("图片未上传成功无法提交！");
            return false;
        }
        userid = "";
    }
    ShowLoading();
    var savepath = "InvestorFolder";
    var fname = guid();
    var companyName = $.trim($("#CompanyName").val());
    var companyLogo = savepath + "\\" + fname;
    var fundScale = $.trim($("#FundScale").val());
    var investmentField = $.trim($("#InvestmentField").val());
    var investorName = $.trim($("#InvestorName").val());
    var email = $.trim($("#Email").val());
    var investmentStage = $.trim($("#selectBtn").val());
    var address = $.trim($("#Address").val());
    var investmentCase = $.trim($("#InvestmentCase").val());


    var frPublish = {
        UserID: userid,
        CompanyName: companyName,
        CompanyLogo: companyLogo,
        FundScale: fundScale,
        InvestmentField: investmentField,
        InvestorName: investorName,
        Email: email,
        InvestmentStage: investmentStage,
        Address: address,
        InvestmentCase: investmentCase
    };
    var weixin = {
        SavePath: savepath,
        MediaID: medid,
        FileName: fname
    };
    var formObj = {
        "InvestorInformation": frPublish,
        "WeiXinRequest": weixin
    };
    var parameter = {
        requestUri: "/api/investorinformation",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    var submiturl = "/api/proxy/put";
    if (userid == null || userid == undefined || userid == "") {
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
   window.location.href = "investorlist.html";
}

//获取投资阶段信息
function GetInvestmentStage() {
    var formObj = {
        "Key": "InvestmentStage"
    };
    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);

    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (data) {
            var results = data.results;
            if (results != null && results != undefined && results.length > 0) {
                var htmlItem = "";
                for (var i = 0; i < results.length; i++) {
                    if (i == 0) {
                        htmlItem += "<option value=\"" + results[i].id + "\" selected>" + results[i].value + "</option>";
                    } else {
                        htmlItem += "<option value=\"" + results[i].id + "\">" + results[i].value + "</option>";
                    }
                }
                $("#selectBtn").html(htmlItem);
                $("#selectBtn").mobiscroll().select({
                    theme: "default",
                    lang: "zh",
                    mode: "scroller",
                    display: "bottom",
                    animate: "fade"
                });
            }
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}