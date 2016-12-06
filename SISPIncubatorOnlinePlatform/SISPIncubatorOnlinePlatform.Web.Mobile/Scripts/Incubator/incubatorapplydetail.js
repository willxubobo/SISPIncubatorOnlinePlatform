//页面加载
$(function () {

    CheckUserLogin();

    var id = getUrlParam("id");
    $("#hidApplyId").val(id);
    if ($.trim(id) != "") {
        LoadData();
    }
});
//加载数据
function LoadData() {

    ShowLoading();

    var id = $("#hidApplyId").val();
    var parameter = {
        requestUri: "/api/incubatorapply/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;

               var index = results[0].incubatorLogoPath.lastIndexOf(".");
               var frontPart = results[0].incubatorLogoPath.substring(0, index);
               var lastPart = results[0].incubatorLogoPath.substring(index);
               var newLog = frontPart + "_m" + lastPart;
               var newLogs = frontPart + "_s" + lastPart;

               $("#imgIncubatorPath").attr("src", newLog);
               $("#pIncubatorName").html(results[0].incubatorName);
               $("#divProjectName").html(results[0].projectName);
               $("#divCompanyName").html(results[0].companyName);
               $("#divCompanyPhone").html(results[0].companyTel);
               $("#divProjectOwner").html(results[0].projectOwner);
               $("#divContactPhone").html(results[0].contactTel);
               $("#divEmail").html(results[0].email);
               $("#divTeamMembers").html(results[0].teamMembers);
               $("#divProductDescription").html(ProcessWrap(results[0].productDescription));
               $("#divCoreStaffResume").html(ProcessWrap(results[0].coreStaffResume));
               $("#divMarketRiskAnalysis").html(ProcessWrap(results[0].marketRiskAnalysis));
               $("#divFinancingSituation").html(ProcessWrap(results[0].financingSituation));

               var html = "<li class='incubatorItem'><div class=\"incubatorPic\"><img onclick=\"OpenInucubatorInfo('" + results[0].incubatorID + "')\" src='" + newLogs + "'  alt=\"\"/>";
               html += " </div>";
               html += "<div class=\"incubatorTxt\">" + results[0].incubatorName + "</div><input type=\"hidden\" value='" + results[0].incubatorID + "' id=\"hidValue\"/></li>";
               $(".aSelectIncubator").parent().before(html);

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}