
$(function () {
    InitInvestorData();
});
//根据frid获取信息
function GetInfo(frid) {
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
            if (result.results != null && result.results != undefined && result.results.length > 0) {
                $(".authinfo").show();
                $(".authlogin").hide();
                $("#CompanyName").html(result.results[0].companyName);
                $("#InvestmentField").html(result.results[0].investmentField);
                $("#imglogo").show();
                $(".investorcomlogo").attr("src", result.results[0].companyLogo);
                $("#FundScale").html(result.results[0].fundScale);
                $("#InvestorName").html(result.results[0].investorName);
                $("#Email").html(result.results[0].email);
                $("#InvestmentStage").html(result.results[0].investmentStageName);
                $("#Address").html(result.results[0].address);
                $("#InvestmentCase").html(result.results[0].investmentCase);
                HideLoading();
            } else {
                $(".authlogin").show();
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//是否登录
function InitInvestorData() {
    ShowLoading();
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",
        //data: parameterJson,
        success: function (result) {
            if (result != null) {
                GetInfo(result.userID);
                $("#userId").val(result.userID);
            } else {
                $(".authlogin").show();
            }
            HideLoading();
        },
        error: function (result) {
            $(".authlogin").show();
            HideLoading();
        }
    });
}

function goauthpage() {
    location.href = "investorauth.html";
}
