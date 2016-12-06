
$(function () {

    //ShowLoading();
    $(".tabs-title-box>.tab-title-admin").on("click", function () {
        $(this).addClass("tab-cur").siblings().removeClass("tab-cur");
        var index = $(".tabs-title-box>.tab-title-admin").index(this);
        $(".tabs-content-box>.tabs-content").eq(index).show().siblings().hide();
    });
    CheckUserLogin();
    GetIncubatorDetail();
});
//获取详情
function GetIncubatorDetail() {
    var incubatorId = getUrlParam("id");
    var parameter = {
        requestUri: "/api/incubator/" + incubatorId,
        requestParameters: incubatorId
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get/anonymous",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               var logo = results[0].logo;
               var projectList = results[0].incubatorProjects;

               //var index = logo.lastIndexOf(".");
               //var frontPart = logo.substring(0, index);
               //var newLog = frontPart + "_m.jpg";

               //信息介绍
               $("#imgIncubatorLogo").attr("src", logo);
               $("#divIncubatorName").html(results[0].incubatorName);

               $("#spanOperationAddress").text(results[0].operationAddress);
               $("#spanregTime").text( results[0].regTime );
               $("#spanfinancialSupport").text(results[0].financialSupport == true ? "有" : "无");
               $("#spanSiteFavorable").text(results[0].siteFavorable);
               $("#spanOtherService").text(results[0].otherService);
               $("#spanService").text(results[0].service);

               var industryRequirement = results[0].industryRequirement;
               var locationRequirement = results[0].locationRequirement;
               var otherRequirement = results[0].otherRequirement;
               
               $("#pIncubatorDes").text(results[0].description);

               $("#pIndustryRequirement").text(ProcessWrap(industryRequirement));
               $("#pLocationRequirement").text(ProcessWrap(locationRequirement));
               $("#pOtherRequirement").text(ProcessWrap(otherRequirement));
               //项目详情
               for (var i = 0; i < projectList.length; i++) {
                   var html = "";
                   var pindex = projectList[i].projectPicture.lastIndexOf(".");
                   var pfrontPart = projectList[i].projectPicture.substring(0, pindex);
                   var pnewLog = pfrontPart + "_m.jpg";

                   html += " <div class=\"incubatorInfo relative\"><div class=\"tabs-img\"><img src='"+pnewLog+"' alt=\"\"></div><div class=\"tabs-txt\">";
                   html += " <p>" + projectList[i].description + "</p></div></div>";
                   var projectType = projectList[i].projectType;
                   if ($.trim(projectType) == "0") {
                       $(".divRegistered").append(html);
                   } else if ($.trim(projectType) == "1") {
                       $(".divHatching").append(html);
                   } else if ($.trim(projectType) == "2") {
                       $(".divIncubatored").append(html);
                   } else {
                       $(".divSeekFinancing").append(html);
                   }
               }

               $("#incubatorId").val(results[0].incubatorID);
               $("#incubatorName").val(results[0].incubatorName);
               $("#incubatorLogo").val(logo);

               //HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

function tabSwiper() {
    $(".tabs-title-box .tab-title:first").addClass("tab-cur");
    $(".tabs-content-box>.tabs-content").not(":first").hide();
    $(".tabs-title-box>.tab-title").hover(function () {
        $(this).addClass("tab-cur").siblings().removeClass("tab-cur");
        var index = $(".tabs-title-box>.tab-title").index(this);
        $(".tabs-content-box>.tabs-content").eq(index).show().siblings().hide();
    });

    $(".div_business_tab>div:first").addClass("selected");
    $(".div_business_tab_content>.div_business_content").not(":first").hide();
    $(".div_business_tab>div").hover(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var index = $(".div_business_tab>div").index(this);
        $(".div_business_tab_content>.div_business_content").eq(index).fadeIn(1000).siblings().hide();
    });

    $(".tab-title-box>.tab-title:first").addClass("on");
    $(".tab-content-box>.tab-content").not(":first").hide();
    $(".tab-title-box>.tab-title").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var index = $(".tab-title-box>.tab-title").index(this);
        $(".tab-content-box>.tab-content").eq(index).show().siblings().hide();
    });
};

