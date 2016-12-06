$(function () {
    InitServiceData();

});

function InitServiceData() {
    InitServiceDetailData();
}

function InitServiceDetailData() {
    var serviceId = getUrlParam("id");
    var parameter = {
        "requestUri": "/api/servicepublish/" + serviceId,
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
            if (result.results && result.results.length > 0) {
                $("#headImg").prop("src", result.results[0].imgUrl);
                $("#companyName").text(result.results[0].companyName);
                $("#industry").text("所属行业：" + result.results[0].industryName);
                $("#email").append("<a class='tellEmail' href='mailto:" + result.results[0].email + "'>" + result.results[0].email + "</a>");
                $("#category").text("所属类别：" + result.results[0].category);
                $("#phone").text(result.results[0].phoneNumber);
                $("#address").text("地址：" + result.results[0].address);
                $("#description").text(result.results[0].description);
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").text("有效时间：");
                }
                else {
                    $("#expiryDate").text("有效时间：" + result.results[0].expiryDate.substr(0, 10));
                }
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

