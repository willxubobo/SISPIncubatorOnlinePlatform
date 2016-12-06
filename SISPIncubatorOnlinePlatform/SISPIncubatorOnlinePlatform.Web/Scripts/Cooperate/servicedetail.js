$(function () {
    InitServiceData();
});

function InitServiceData() {
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
                if (result.results[0].email == "") {
                    $("#tdemail").text("邮箱：登陆可见");
                    $("#phone").text("登陆可见");
                }
                else {
                    $("#tdemail").empty();
                    $("#tdemail").append("邮箱：<a id='email'></a>");
                    $("#phone").text(result.results[0].phoneNumber);
                    $("#email").text(result.results[0].email);
                    $("#email").attr("href", "mailto:" + result.results[0].email);
                }
                $("#category").text("所属类别：" + result.results[0].category);
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