
$(function () {
    CheckUserLogin();
    CheckUserLogin();
    InitFormData();
});
//初始化页面表单
function InitFormData() {
    var applyId = getUrlParam("id");
    if ($.trim(applyId) != "") {
        $("#hidApplyId").val(applyId);
        GetIncubatorApplyInfo(applyId);
    }
}
//获取单个申请记录
function GetIncubatorApplyInfo(id) {
    ShowLoading();
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

               $("#divProjectName").html(results[0].projectName);
               $("#divCompanyName").html(results[0].companyName);
               $("#divCompanyPhone").html(results[0].companyTel);
               $("#divProjectOwner").html(results[0].projectOwner);
               $("#divContactPhone").html(results[0].contactTel);
               $("#divEmail").html("<a href=\"mailto:" + results[0].email + "\"><span class=\"spanFlag\">" + results[0].email + "</span></a>");
               $("#divTeamMembers").html(results[0].teamMembers);
               $("#pProductDescription").html(ProcessWrap(results[0].productDescription));
               $("#pCoreStaffResume").html(ProcessWrap(results[0].coreStaffResume));
               $("#pMarketRiskAnalysis").html(ProcessWrap(results[0].marketRiskAnalysis));
               $("#pFinancingSituation").html(ProcessWrap(results[0].financingSituation));
               //$("#spanIncubatorName").text(results[0].incubatorName);

               var approveHistory = results[0].approveRecords;
               var html = "";
               for (var i = 0; i < approveHistory.length; i++) {

                   var node = "提交申请";
                   var result = "提交申请";
                   if (approveHistory[i].approveResult == null && approveHistory[i].approveNode == "0") {
                       node = "提交申请";
                       result = "提交申请";
                   } else if (approveHistory[i].approveNode == "1") {
                       node = "管理员审批";
                       result = "审核通过";
                   }
                   else if (approveHistory[i].approveNode == "3") {
                       node = "管理员审批";
                       result = "审核驳回";
                   }

                   html += "<tr>";
                   html += "<td colspan=\"4\" class=\"tdApproveResult\">";
                   html += " <p>" + node + "</p>";
                   html += " <ul>";
                   html += "    <li>公共孵化器审核</li>";
                   html += "   <li><span>结果：</span><span>"+result+"</span></li>";
                   html += " <li><span>审核人：</span><span>" + approveHistory[i].approverUser + "<span></span></span></li>";
                   html += "                   <li><span>时间：</span><span>"+ approveHistory[i].createdDate +"<span></span></span></li>";
                   html += "                </ul>";
                   html += "            </td>";
                   html += "        </tr>";
               }
               //$("#trApproveHistory").after(html);
               var html = "<img onclick=\"OpenInucubatorInfo('" + id + "')\" style='width:200px;height:200px;' src='" + results[0].incubatorLogoPath + "'  alt=\"\"/>";
               html += "<div class=\"apply-txt\">" + results[0].incubatorName + "</div><input type=\"hidden\" value='" + results[0].incubatorID + "' id=\"hidValue\"/>";

               $(".divIncubator").html(html);
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

