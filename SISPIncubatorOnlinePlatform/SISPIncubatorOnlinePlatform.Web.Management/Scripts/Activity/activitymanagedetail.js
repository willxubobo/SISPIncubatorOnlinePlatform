$(function () {
    InitActivityData();

});

function InitActivityData() {
    InitActivityDetailData();
}

function InitActivityDetailData() {
    var id = getUrlParam("id");
    var type = getUrlParam("type");
    if (type != null && type != "") {
        $(".Info_divApplybtn").hide();
    }
    var category = getUrlParam("category");
    var activitydetail = {
        id: id,
        category: category
    };
    var parameter = {
        "requestUri": "/api/activitycalendar/detail",
        "requestParameters": activitydetail
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null) {
                $("#activityTitle").text(result.topic);
                var startDate = new Date(result.startTime.replace(/T/g, ' ').split(' ')[0]);
                var startYear = startDate.getFullYear();
                var startMonth = startDate.getMonth() + 2;
                var startDay = startDate.getDate();
                var endDate = new Date(result.endTime.replace(/T/g, ' ').split(' ')[0]);
                var endYear = endDate.getFullYear();
                var endDay = endDate.getDate();
                var endMonth = endDate.getMonth() + 2;
                var startTime = new Date(startYear + '/' + startMonth + '/' + startDay).Format("yyyy-MM-dd");
                var endTime = new Date(endYear + '/' + endMonth + '/' + endDay).Format("yyyy-MM-dd");
                $("#dateTime").text(startTime + " ~ " + endTime);
                $("#timeBucket").text(result.timeBucket);
                $("#address").text(result.address);
                $("#sponsor").text(result.sponsor);
                $("#cosponsor").text(result.cosponsor);
                $("#phone").append("<label>" + result.phoneNumber + "</label>");
                $("#email").append("<a class='tellEmail' href='mailto:" + result.email + "'>" + result.email + "</a>");
                $("#activityTxt").html(result.activityDescription);
                $("#activityId").val(result.activityId);
                $("#hiddenName").val(result.userName);
                $("#hiddenPhone").val(result.mobile);
                var html = "";
                for (var i = 0; i < result.imgSrcList.length; i++) {
                    if (i < 5) {
                        html += " <li><a href=\"" + result.imgSrcList[i] + "\"><img src=\"" + result.imgSrcList[i] + "\"/></a></li>";
                    }
                }
                $(".Info_DivFocusIn").find("ul").each(function () {
                    $(this).append(html);
                })
                if (result.apply) {
                    $(".Info_divApplybtn").hide();
                }
            }

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
