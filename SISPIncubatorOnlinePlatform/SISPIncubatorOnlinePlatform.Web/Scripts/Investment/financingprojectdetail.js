function initfinancingprojectdetail() {
    ShowLoading();
    var frid = getUrlParam("frid");
    if (frid != null && frid != undefined && frid != "") {
        $(".hidfrid").val(frid);
        GetInfo(frid);
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
                $("#CompanyDescription").html(result.results[0].companyDescription);
                $("#financingdetailcomlogo").show();
                $("#financingdetailcomlogo").attr("src", result.results[0].projectLogo);
                $("#ProductionDescription").html(result.results[0].productionDescription);
                $("#Industry").html(result.results[0].industryName);
                $("#FinancingAmount").html(result.results[0].financingAmount+"万元");
                $("#DevelopmentalStage").html(result.results[0].developmentalStage);
                $("#MarketAnalysis").html(result.results[0].marketAnalysis);
                $("#CoreTeam").html(result.results[0].coreTeam);
                $("#OtherInfo").html(result.results[0].otherInfo);

            }
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
