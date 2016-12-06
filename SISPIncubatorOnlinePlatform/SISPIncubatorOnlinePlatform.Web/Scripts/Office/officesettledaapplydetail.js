
//页面加载
$(function () {

    if (!CheckUserLogin()) return;

    InitFormData();
});
//加载数据
function LoadData() {

    ShowLoading();

    var id = $("#hidApplyId").val();

    var parameter = {
        requestUri: "/api/officeapply/" + id,
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

               if (results.length > 0) {
                   $("#divProjectOwner").html(results[0].projectOwner);

                   var gender = results[0].gender;
                   if ($.trim(gender) == "1") {
                       $("#divSex").html("男");
                   } else {
                       $("#divSex").html("女");
                   }
                   $("#divDegree").html(results[0].degree);
                   $("#divSpecialty").html(results[0].specialty);
                   $("#divAddress").html(results[0].address);
                   $("#divContactPhone").html(results[0].phoneNumber);
                   $("#divEmail").html("<a href=\"mailto:" + results[0].email + "\"><span class=\"spanFlag\">" + results[0].email + "</span></a>");
                   $("#divDiplomas").html(ProcessWrap(results[0].diplomas));
                   $("#divIntellectualProperty").html(ProcessWrap(results[0].intellectualProperty));
                   $("#divCompanyName").html(results[0].companyName);
                   $("#divRegisteredCapital").html(results[0].registeredCapital);
                   $("#divDemandForSpace").html(results[0].demandForSpace);
                   $("#divInitialStaff").html(results[0].initialStaff);
                   $("#divProductDescription").html(ProcessWrap(results[0].productDescription));
                   $("#divMemberDescription").html(ProcessWrap(results[0].memberDescription));
                   $("#divFinancingAndRevenue").html(ProcessWrap(results[0].financingAndRevenue));
                   var officeApplyWorkExperience = results[0].officeApplyWorkExperienceDtos;
                   var detailArry = new Array();
                   for (var i = 0; i < officeApplyWorkExperience.length; i++) {
                       var sDate = new Date(officeApplyWorkExperience[i].startDate);
                       var eDate = new Date(officeApplyWorkExperience[i].endDate);
                       var detail = {
                           "id": officeApplyWorkExperience[i].applyID,
                           "startDate": sDate.FormatIncludeZero("yyyy-MM-dd"),
                           "endDate": eDate.FormatIncludeZero("yyyy-MM-dd"),
                           "workAddress": officeApplyWorkExperience[i].schoolOrEmployer,
                           "position": officeApplyWorkExperience[i].jobTitle
                       }
                       detailArry.push(detail);
                   }
                   OrderByEndDate(detailArry);
               }

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//排序（按照结束日期排序）
function OrderByEndDate(detailArry) {

    var i, j, tag, temp;
    for (i = 0, tag = 1; i < detailArry.length - 1 && tag == 1; i++) {
        tag = 0;
        for (j = 0; j < detailArry.length - i - 1; j++) {
            var aa = detailArry[j].endDate;
            var bb = detailArry[j + 1].endDate;
            var start = new Date(aa.replace("-", "/").replace("-", "/"));
            var end = new Date(bb.replace("-", "/").replace("-", "/"));
            if (start > end) {
                temp = detailArry[j];
                detailArry[j] = detailArry[j + 1];
                detailArry[j + 1] = temp;
                tag = 1;
            }
        }
    }
    $(".pWorkHistory").remove();
    var html = "";
    for (var k = detailArry.length - 1; k >= 0 ; k--) {
       
        html += "<p class='pWorkHistory'>" + detailArry[k].startDate + "~" + detailArry[k].endDate + "：" + detailArry[k].workAddress + "";
        if ($.trim(detailArry[k].position) != "") {
            html += ";" + detailArry[k].position + "";
        }
        html += "</p>";
    }
    $(".pWorkHistoryTitle").after(html);
}
//初始化数据
function InitFormData() {
    var id = getUrlParam("id");
    $("#hidApplyId").val(id);
    if ($.trim(id) != "") {
        LoadData();
    }
}