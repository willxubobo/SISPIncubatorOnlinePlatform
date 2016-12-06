$(function () {
    InitCaseData();

});

function InitCaseData() {
    InitCaseDetailData();
}


function InitCaseDetailData() {
    var caseId = getUrlParam("id");
    var parameter = {
        "requestUri": "/api/successfulcase/" + caseId
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                $("#title").text(result.results[0].title);
                $("#create").text(result.results[0].created.substr(0, 10));
                $("#content").text(result.results[0].content);
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
