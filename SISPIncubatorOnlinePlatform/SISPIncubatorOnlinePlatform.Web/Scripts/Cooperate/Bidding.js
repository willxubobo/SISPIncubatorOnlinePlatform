$(function () {
    InitBiddingData();
    tabSwiper();
});

function InitBiddingData() {
    var parameter = {
        requestUri: "/api/Biddings",
        "requestParameters": {}
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result.results.length > 0) {
                GetCooperateHtml(result.results);
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
var demandHtml = "";
var serviceHtml = "";
function GetCooperateHtml(data) {

    for (var i = 0; i < data.length; i++) {
        if (data[i].category == 0) {
            GetDemandHtml(data[i]);
        }
        else {
            GetServiceHtml(data[i]);
        }
    }
    $("#demandbusiness").append(demandHtml);
    $("#servicebusiness").append(serviceHtml);
}

function GetDemandHtml(data) {
    var companyName = data.companyName;
    if (companyName.length > 8) {
        companyName = companyName.substr(0, 8) + "...";
    }
    var description = data.description;
    if (description.length > 20) {
        description = description.substr(0, 20) + "...";
    }
    demandHtml += "<li>\
					<div>\
						<img src='"+ data.imgUrl + "' />\
						<div class='divBusiness_title'>\
							<span title=" + data.companyName+">" + companyName + "</span>\
						</div>\
						<div class='clear'></div>\
					</div>\
					<p title=" + data.description + ">" + description + "</p>\
					<a href='cooperate/demanddetail.html?id=" + data.id + "' target='_blank'><div class='divBusiness_detail'>详情</div></a>\
				</li>";

}

function GetServiceHtml(data) {
    var companyName = data.companyName;
    if (companyName.length > 8) {
        companyName = companyName.substr(0, 8) + "...";
    }
    var description = data.description;
    if (description.length > 20) {
        description = description.substr(0, 20) + "...";
    }
    var industry = data.industryName;
    if (GetLength(industry) > 12) {
        serviceHtml += "<li>\
					<div>\
						<img src='"+ data.imgUrl + "' />\
						<div class='divBusiness_title'>\
							<span title=" + data.companyName + ">" + companyName + "</span>\
                            <span>所属行业：<span title='" + industry + "'>" + cutstr(industry, 12) + "</span></span>\
						</div>\
						<div class='clear'></div>\
					</div>\
					<p title=" + data.description + ">" + description + "</p>\
					<a href='cooperate/servicedetail.html?id=" + data.id + "' target='_blank' ><div class='divBusiness_detail'>详情</div></a>\
				</li>";
    }
    else {
        serviceHtml += "<li>\
					<div>\
						<img src='"+ data.imgUrl + "' />\
						<div class='divBusiness_title'>\
							<span>"+ companyName + "</span>\
                            <span>所属行业：" + industry + "</span>\
						</div>\
						<div class='clear'></div>\
					</div>\
					<p>"+ data.description + "</p>\
					<a href='cooperate/servicedetail.html?id=" + data.id + "' target='_blank' ><div class='divBusiness_detail'>详情</div></a>\
				</li>";
    }

}

function tabSwiper() {
    $(".tabs-title-box .tab-title:first").addClass("tab-cur");
    $(".tabs-content-box>.tabs-content").not(":first").hide();
    $(".tabs-title-box>.tab-title").click(function () {
        $(this).addClass("tab-cur").siblings().removeClass("tab-cur");
        var index = $(".tabs-title-box>.tab-title").index(this);
        $(".tabs-content-box>.tabs-content").eq(index).show().siblings().hide();
    });

    $(".div_business_tab>div:first").addClass("selected");
    $(".div_business_tab_content>.div_business_content").not(":first").hide();
    $(".div_business_tab>div").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var index = $(".div_business_tab>div").index(this);
        $(".div_business_tab_content>.div_business_content").eq(index).show().siblings().hide();
    });
    $(".tab-title-box>.tab-title:first").addClass("on");
    $(".tab-content-box>.tab-content").not(":first").hide();
    $(".tab-title-box>.tab-title").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var index = $(".tab-title-box>.tab-title").index(this);
        $(".tab-content-box>.tab-content").eq(index).show().siblings().hide();
    });
};
