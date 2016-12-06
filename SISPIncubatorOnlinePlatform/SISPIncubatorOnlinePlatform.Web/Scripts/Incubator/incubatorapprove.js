
$(function () {
    if (!CheckUserLogin()) return;
    InitFormData();
});
//初始化表单数据
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
               $("#divEmail").html(results[0].email);
               $("#divTeamMembers").html(results[0].teamMembers);
               $("#pProductDescription").html(results[0].productDescription);
               $("#pCoreStaffResume").html(results[0].coreStaffResume);
               $("#pMarketRiskAnalysis").html(results[0].marketRiskAnalysis);
               $("#pFinancingSituation").html(results[0].financingSituation);
               $("#spanIncubatorName").text(results[0].incubatorName);

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
                       result = "审批通过";
                   }
                   else if (approveHistory[i].approveNode == "3") {
                       node = "管理员审批";
                       result = "审批驳回";
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
               $("#trApproveHistory").after(html);
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//提交通过 
//通过或者拒绝
function UpdateApprove(approveType) {
    var comments = $("#txtComments").val();
    if (approveType == "0" && $.trim(comments) == "") {
        $("#txtComments").next().show();
        return;
    } else {
        $("#txtComments").next().hide();
    }

    var applyId = $("#hidApplyId").val();

    var incubatorObj = {
        ApplyID: applyId
    };

    var formObj = {
        IncubatorApply: incubatorObj,
        ApproveStatus: approveType,
        Comments: comments
    };

    var parameter = {
        requestUri: "/api/incubatorapply/approve",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/put",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert('提交成功');
            setTimeout(function () {
                location.href = 'incubatorapproveandlist.html';
            }, 2000);
           
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
