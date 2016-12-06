$(function () {
    InitData();
});

function InitData() {
    ShowLoading();
    var demandId = getUrlParam("id");
    var parameter = {
        "requestUri": "/api/demandpublish/" + demandId,
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
                $("#companyName").text("公司名称: " + result.results[0].companyName);
                $("#contact").text("联系人: " + result.results[0].contacts);
                if (result.results[0].email == "") {
                    $("#email").text("电子邮箱： 登陆可见");
                    $("#phone").text("联系电话： 登陆可见");
                }
                else {
                    $("#phone").append("联系电话：<a class='tellEmail' href='tel:" + result.results[0].mobile + "'>" + result.results[0].mobile + "</a>");
                    $("#email").append("电子邮箱：<a class='tellEmail' href='mailto:" + result.results[0].email + "'>" + result.results[0].email + "</a>");
                }
                $("#projectDescription").html(ProcessWrap(result.results[0].projectDescription));
                $("#member").text("团队人数: " + result.results[0].members);
                $("#intentionPartner").html("意向合作对象: " + ProcessWrap(result.results[0].intentionPartner));
                $("#demandDescription").html(ProcessWrap(result.results[0].demandDescription));
                $("#foundedTime").text("成立时间: " + result.results[0].foundedTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").text("有效时间:");
                }
                else {

                    $("#expiryDate").text("有效时间: " + result.results[0].expiryDate.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                }
                $("#category").text("所属类别：" + result.results[0].category);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}