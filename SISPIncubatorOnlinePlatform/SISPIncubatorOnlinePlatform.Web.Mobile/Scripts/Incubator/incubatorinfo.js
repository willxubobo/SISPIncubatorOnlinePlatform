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

               var index = logo.lastIndexOf(".");
               var frontPart = logo.substring(0, index);
               var lastPart = logo.substring(index);
               var newLog = frontPart + "_m" + lastPart;

               //信息介绍
               $(".imgIncubatorLogo").attr("src", newLog);
               $(".pAddress").html(results[0].operationAddress);
               $(".pFoundDate").html("成立时间：" + results[0].regTime);
               var financialSupport = results[0].financialSupport == true ? "有" : "无";
               $(".pFinancialSupport").html("资金支持：" + financialSupport);
               $(".pOtherServices").html("其他服务：" + results[0].otherService);
               $(".pIncubatorInfo").html(results[0].description);

               var html1 = "";
               var html2 = "";
               var html3 = "";
               var industryRequirement = results[0].industryRequirement;
               var locationRequirement = results[0].locationRequirement;
               var otherRequirement = results[0].otherRequirement;
               if ($.trim(industryRequirement) != "") {
                   html1 = "<div class=\"agreementTitle padding-space\">项目行业要求</div>";
                   html1 += "<p class=\"businessTxt\">" + industryRequirement + "</p>";
               }
               if ($.trim(locationRequirement) != "") {
                   html2 = "<div class=\"agreementTitle padding-space\">项目所在地要求</div>";
                   html2 += "<p class=\"businessTxt\">" + locationRequirement + "</p>";
               }
               if ($.trim(otherRequirement) != "") {
                   html3 = "<div class=\"agreementTitle padding-space\">其他要求</div>";
                   html3 += "<p class=\"businessTxt\">" + otherRequirement + "</p>";
               }
               $(".divIncubatorInformation").html(html1 + html2 + html3);
               //项目详情
               for (var i = 0; i < projectList.length; i++) {
                   var html = "";

                   var pindex = projectList[i].projectPicture.lastIndexOf(".");
                   var pfrontPart = projectList[i].projectPicture.substring(0, pindex);
                   var pnewLog = pfrontPart + "_m.jpg";

                   html += "<div class=\"projectInfoBox\"><div class=\"projectPic\"><img src='" + pnewLog + "' alt=\"\" /></div>";
                   html += " <div class=\"projectTxt\">" + projectList[i].description + "</div></div>";
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


               $("#incubatorId").val(incubatorId);
               $("#incubatorName").val(results[0].incubatorName);
               $("#incubatorLogo").val(logo);

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

function SetIncubatorApply() {
    var id = $("#incubatorId").val();
    window.location.href = 'incubatorapply.html?infoid=' + id + '&' + MathRand(6);
}


$(function () {

    ShowLoading();

    GetIncubatorDetail();

    IncubatorTabs();
});

function IncubatorTabs() {
    $(".infoTitle:first").addClass("curTitle");
    $(".businessTxtBox>div").not(":first").hide();
    $(".infoTitle>div").click(function () {

        var index = $(".infoTitle>div").index(this);
        $(".businessTxtBox>div").eq(index).siblings().hide();
        $(this).parent().addClass("curTitle").siblings().removeClass("curTitle");

    });

    $(".projectInfoTabs>.projectTabs:first").addClass("on");
    $(".projectBox>.projectBoxContent").not(":first").hide();
    $(".projectInfoTabs>.projectTabs").click(function () {
        var index = $(".projectInfoTabs>.projectTabs").index(this);
        $(".projectBox>.projectBoxContent").eq(index).siblings().hide();
        $(this).addClass("on").siblings().removeClass("on");
    });
};