$(function () {
    InitDemandData();

});

function InitDemandData() {
    InitDemandDetailData();
}


function InitDemandDetailData() {
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
            if (result.results && result.results.length > 0) {
                $("#headImg").prop("src", result.results[0].imgUrl);
                $("#companyName").text(result.results[0].companyName);
                $("#contact").text("联系人：" + result.results[0].contacts);
                $("#phone").text(result.results[0].mobile);
                $("#email").append("<a class='tellEmail' href='mailto:" + result.results[0].email + "'>" + result.results[0].email + "</a>");
                $("#projectDescription").text(result.results[0].projectDescription);
                $("#member").text("团队人数：" + result.results[0].members);
                $("#intentionPartner").text("意向合作对象：" + result.results[0].intentionPartner);
                $("#demandDescription").text(result.results[0].demandDescription);
                $("#foundedTime").text("成立时间：" + result.results[0].foundedTime.substr(0, 10));
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").text("有效时间：");
                }
                else {
                    $("#expiryDate").text("有效时间：" + result.results[0].expiryDate.substr(0, 10));
                }
                $("#category").text("所属类别：" + result.results[0].category);
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
