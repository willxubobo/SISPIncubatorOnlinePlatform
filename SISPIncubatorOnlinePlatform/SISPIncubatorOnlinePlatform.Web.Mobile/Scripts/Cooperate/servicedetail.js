$(function () {
    InitData();
});

function InitData() {
    ShowLoading();
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
            if (result != null && result.results.length > 0) {
                $("#companyName").text("公司名称：" + result.results[0].companyName);
                $("#industry").text("所属行业：" + result.results[0].industryName);
                if (result.results[0].email == "") {
                    $("#email").text("电子邮箱：登陆可见");
                    $("#phone").text("联系电话：登陆可见");
                }
                else {
                    $("#phone").append("联系电话：<a class='tellEmail' href='tel:" + result.results[0].phoneNumber + "'>" + result.results[0].phoneNumber + "</a>");
                    $("#email").append("电子邮箱：<a class='tellEmail' href='mailto:" + result.results[0].email + "'>" + result.results[0].email + "</a>");
                }
                $("#category").text("所属类别：" + result.results[0].category);
                $("#address").text("公司地址：" + result.results[0].address);
                $("#description").html(ProcessWrap(result.results[0].description));
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").text("有效时间:");
                }
                else {

                    $("#expiryDate").text("有效时间: " + result.results[0].expiryDate.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                }
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}