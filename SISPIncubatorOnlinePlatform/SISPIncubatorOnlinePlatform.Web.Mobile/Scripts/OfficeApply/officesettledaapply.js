
$(function () {
    CheckUserLogin();

    $("#startTime,#endTime").scroller({
        preset: 'date',
        theme: "default",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        dateFormat: "yy-mm-dd",
        onSelect: function () {
            if (CheckSelectDate()) {
                $(this).click();
            }
        }
    });

    $("#txtRegisteredCapital,#txtDemandForSpace").bind("keyup", function () {
        Check_clearNoNum(this);
    });

    $("#txtPhone").bind("keyup", function () {
        this.value = this.value.replace(/[^\d-]/g, "");
    });

    var id = getUrlParam("id");

    if ($.trim(id) != "") {
        $("#hidApplyId").val(id);
        LoadModifyData();
    }
});



function Check_clearNoNum(obj) {
    var tempValue = obj.value;
    var decimalpoint = "";
    if (tempValue.indexOf(".") >= 0) {
        decimalpoint = tempValue.substring(tempValue.indexOf("."));
    }
    if (isNaN(tempValue) || decimalpoint.length > 3) {
        obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字而不是
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    }
}

function SubmitForm() {
    var a16 = true;
    $(".divWorkTips").hide();
    $(".divWorkTips").html("学校或工作单位不能为空！");
    if ($(".hidValue").length <= 0) {
        $(".divWorkTips").html("学校或工作单位不能为空！");
        $(".divWorkTips").show();
        a16 = false;
    }
    if ($(".hidValue").length > 5 || $(".hidValue").length < 3) {
        $(".divWorkTips").html("学校或工作单位至少三行，最多五行");
        $(".divWorkTips").show();
        a16 = false;
    }
    if (!checkrequire() || !a16) return;

    var applyId = $("#hidApplyId").val();

    ShowLoading();
    //提交，再次提交
    if ($.trim(applyId) == "") {
        SubmitAndSaveForm();
    } else {
        ReSubmitAndSaveForm();
    }
}

//首次提交
function SubmitAndSaveForm() {

    ShowLoading();

    var workExperienceArry = new Array();
    $(".hidValue").each(function () {
        var arrayItem = $(this).val().split('||');
        var detail = {
            "StartDate": arrayItem[1],
            "EndDate": arrayItem[2],
            "SchoolOrEmployer": arrayItem[3],
            "JobTitle": arrayItem[4]
        }
        workExperienceArry.push(detail);
    });

    var officeObj = {
        ProjectOwner: $("#txtPorjectOwner").val(),
        Gender: GetGender(),
        Degree: $("#txtDegree").val(),
        Specialty: $("#txtSpecialty").val(),
        Address: $("#txtAddress").val(),
        PhoneNumber: $("#txtPhone").val(),
        Email: $("#txtEmail").val(),
        Diplomas: $("#txtDiplomas").val(),
        IntellectualProperty: $("#txtIntellectualProperty").val(),
        CompanyName: $("#txtCompanyName").val(),
        RegisteredCapital: $("#txtRegisteredCapital").val(),
        DemandForSpace: $("#txtDemandForSpace").val(),
        InitialStaff: $("#txtInitialStaff").val(),
        ProductDescription: $("#txtProductDescription").val(),
        MemberDescription: $("#txtMemberDescription").val(),
        FinancingAndRevenue: $("#txtFinancingAndRevenue").val(),
        OfficeApplyWorkExperience: workExperienceArry
    };
    var formObj = {
        "OfficeApply": officeObj
    };

    var parameter = {
        requestUri: "/api/officeapply",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (results) {
               //alert("Success");
               gotosuccesspage();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });

}
//再次提交
function ReSubmitAndSaveForm() {
    ShowLoading();

    var workExperienceArry = new Array();
    $(".hidValue").each(function () {
        var arrayItem = $(this).val().split('||');
        var detail = {
            "StartDate": arrayItem[1],
            "EndDate": arrayItem[2],
            "SchoolOrEmployer": arrayItem[3],
            "JobTitle": arrayItem[4]
        }
        workExperienceArry.push(detail);
    });

    var officeObj = {
        ApplyID: $("#hidApplyId").val(),
        ProjectOwner: $("#txtPorjectOwner").val(),
        Gender: GetGender(),
        Degree: $("#txtDegree").val(),
        Specialty: $("#txtSpecialty").val(),
        Address: $("#txtAddress").val(),
        PhoneNumber: $("#txtPhone").val(),
        Email: $("#txtEmail").val(),
        Diplomas: $("#txtDiplomas").val(),
        IntellectualProperty: $("#txtIntellectualProperty").val(),
        CompanyName: $("#txtCompanyName").val(),
        RegisteredCapital: $("#txtRegisteredCapital").val(),
        DemandForSpace: $("#txtDemandForSpace").val(),
        InitialStaff: $("#txtInitialStaff").val(),
        ProductDescription: $("#txtProductDescription").val(),
        MemberDescription: $("#txtMemberDescription").val(),
        FinancingAndRevenue: $("#txtFinancingAndRevenue").val(),
        ApplyStatus: "0",
        OfficeApplyWorkExperience: workExperienceArry
    };
    var formObj = {
        "OfficeApply": officeObj
    };

    var parameter = {
        requestUri: "/api/officeapply",
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
               gotosuccesspage();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//获取性别
function GetGender() {
    var boyClassName = $(".boy").attr('class');
    if (boyClassName.indexOf("on") > 0) {
        return "1";
    }
    return "0";
}

function CheckformValidation() {
    //var porjectOwnerObj = $("#txtPorjectOwner");

    //var a1 = CheckShowError(porjectOwnerObj);

    //var degreeObj = $("#txtDegree");

    //var a2 = CheckShowError(degreeObj);

    //var specialtyObj = $("#txtSpecialty");

    //var a3 = CheckShowError(specialtyObj);

    //var addressObj = $("#txtAddress");

    //var a4 = CheckShowError(addressObj);

    //var phoneNumberObj = $("#txtPhone");

    //var a5 = CheckShowError(phoneNumberObj);

    //var emailObj = $("#txtEmail");

    //var a6 = CheckShowError(emailObj);

    //var diplomasObj = $("#txtDiplomas");

    //var a7 = CheckShowError(diplomasObj);

    //var intellectualPropertyObj = $("#txtIntellectualProperty");

    //var a8 = CheckShowError(intellectualPropertyObj);

    //var companyNameObj = $("#txtCompanyName");

    //var a9 = CheckShowError(companyNameObj);

    //var registeredCapitalObj = $("#txtRegisteredCapital");

    //var a10 = CheckShowError(registeredCapitalObj);

    //var demandForSpaceObj = $("#txtDemandForSpace");

    //var a11 = CheckShowError(demandForSpaceObj);

    //var initialStaffObj = $("#txtInitialStaff");

    //var a12 = CheckShowError(initialStaffObj);

    //var productDescriptionObj = $("#txtProductDescription");

    //var a13 = CheckShowError(productDescriptionObj);

    //var memberDescriptionObj = $("#txtMemberDescription");

    //var a14 = CheckShowError(memberDescriptionObj);

    //var financingAndRevenueObj = $("#txtFinancingAndRevenue");

    //var a15 = CheckShowError(financingAndRevenueObj);
}

//页面取消
function CancelPage() {
    window.location.href = '../home.html';
}
/******/
//打开弹出层
function ShowWorkExperience() {
    $(".popupDiv").show();

    var H = $(window).height();
    $(".wrap").css("height", H);
    $(".wrap").css("overflow", "hidden");
}
//隐藏弹出层
function HideWorkExperience() {
    $(".popupDiv").hide();

    $(".wrap").css("overflow", "auto");
    $(".wrap").css("height", "auto");
}
//取消按钮
function Cancel() {
    ClearData();
    HideWorkExperience();
}
//清空弹出层的数据
function ClearData() {
    $("#startTime").val("");
    $("#endTime").val("");
    $("#txtWorkAddress").val("");
    $("#txtPosition").val("");
    $("#hidOperator").val("add");
    $("#hidId").val("");
    $("#divDateTips").hide();
    $("#divWorkTips").hide();
}
//验证弹出层的数据
function ValidationDateLayer() {
    var startDate = $("#startTime").val();
    var endDate = $("#endTime").val();
    if ($.trim(startDate) == "" || $.trim(endDate) == "") {
        $("#divDateTips").html("日期不能为空！");
        $("#divDateTips").show();
        return true;
    } else {
        $("#divDateTips").hide();
        return false;
    }
}

function ValidationWorkLayer() {
    var workAddress = $("#txtWorkAddress").val();
    if ($.trim(workAddress) == "") {
        $("#divWorkTips").show();
        return true;
    } else {
        $("#divWorkTips").hide();
        return false;
    }
}

function CheckSelectDate() {
    var startDate = $("#startTime").val();
    var endDate = $("#endTime").val();
    var start = new Date(startDate.replace("-", "/").replace("-", "/"));
    var end = new Date(endDate.replace("-", "/").replace("-", "/"));
    if (startDate != "" && endDate != "") {
        if (end <= start) {
            $("#divDateTips").html("结束日期应该大于开始日期！");
            $("#divDateTips").show();
            return true;
        } else {
            $("#divDateTips").hide();
            $("#divDateTips").html("");
            return false;
        }
    }

}

//确定新增
function SaveOk() {

    var a = ValidationDateLayer();
    var b = ValidationWorkLayer();
    var c = CheckSelectDate();

    if (a || b || c) return;
    var operator = $("#hidOperator").val();
    var detailArry = new Array();

    $(".hidValue").each(function () {
        var arrayItem = $(this).val().split('||');
        var detail = {
            "id": arrayItem[0],
            "startDate": arrayItem[1],
            "endDate": arrayItem[2],
            "workAddress": arrayItem[3],
            "position": arrayItem[4]
        }
        detailArry.push(detail);
    });

    if (operator == "modify") {

        var id = $("#hidId").val();

        for (var l = 0; l < detailArry.length; l++) {
            if (detailArry[l].id == id) {
                detailArry[l].startDate = $("#startTime").val();
                detailArry[l].endDate = $("#endTime").val();
                detailArry[l].workAddress = $("#txtWorkAddress").val();
                detailArry[l].position = $("#txtPosition").val();
            }
        }
    } else {
        var radom = MathRand(10);
        var startDate = $("#startTime").val();
        var endDate = $("#endTime").val();
        var workAddress = $("#txtWorkAddress").val();
        var position = $("#txtPosition").val();
        var detail = {
            "id": radom,
            "startDate": startDate,
            "endDate": endDate,
            "workAddress": workAddress,
            "position": position
        }
        detailArry.push(detail);
    }
    OrderByEndDate(detailArry);

    Cancel();

    $(".divWorkTips").hide();
}
///删除工作经历
function DelItem(obj) {
    $(this).confirm({
        message: "确定删除吗？",
        yes: function () {
            $(obj).parent().remove();
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
    $(".divWorkExperience").empty();

    for (var k = detailArry.length - 1; k >= 0 ; k--) {

        var dataStr = detailArry[k].id + "||" + detailArry[k].startDate + "||" + detailArry[k].endDate + "||" + detailArry[k].workAddress + "||" + detailArry[k].position;
        var html = "";
        html = "<div class=\"baseInfoBox\"><div class=\"educationInfo\">";
        html += "<p class=\"educationInfoTxt\">" + detailArry[k].startDate + "~" + detailArry[k].endDate + "</p><p class=\"educationInfoTxt\">" + detailArry[k].workAddress + "";
        if ($.trim(detailArry[k].position) != "") {
            html += "【" + detailArry[k].position + "】";
        }
        html += "</p></div><input  value='" + dataStr + "' class=\"hidValue\" type=\"hidden\" /><input class=\"editEduBtn\" onclick='Modify(this);' type=\"button\"/><input class=\"removeEduBtn\" onclick='DelItem(this);' type=\"button\"/></div>";
        $(".divWorkExperience").append(html);
    }
}
//新增
function Add() {
    $("#hidOperator").val("add");
    ShowWorkExperience();
}
//修改
function Modify(obj) {
    var arrayItem = $(obj).parent().find(".hidValue").val().split('||');
    $("#hidId").val(arrayItem[0]);
    $("#startTime").val(arrayItem[1]);
    $("#endTime").val(arrayItem[2]);
    $("#txtWorkAddress").val(arrayItem[3]);
    $("#txtPosition").val(arrayItem[4]);
    $("#hidOperator").val("modify");
    ShowWorkExperience();
}

/*******退回修改开始*******/
function LoadModifyData() {

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
                   $("#txtPorjectOwner").val(results[0].projectOwner);
                   $("#txtDegree").val(results[0].degree);
                   var gender = results[0].gender;
                   if ($.trim(gender) == "1") {
                       $(".boy").addClass("on");
                       $(".girl").removeClass("on");
                   } else {
                       $(".girl").addClass("on");
                       $(".boy").removeClass("on");
                   }
                   $("#txtSpecialty").val(results[0].specialty);
                   $("#txtAddress").val(results[0].address);
                   $("#txtPhone").val(results[0].phoneNumber);
                   $("#txtEmail").val(results[0].email);
                   $("#txtDiplomas").val(results[0].diplomas);
                   $("#txtIntellectualProperty").val(results[0].intellectualProperty);
                   $("#txtCompanyName").val(results[0].companyName);
                   $("#txtRegisteredCapital").val(results[0].registeredCapital);
                   $("#txtDemandForSpace").val(results[0].demandForSpace);
                   $("#txtInitialStaff").val(results[0].initialStaff);
                   $("#txtProductDescription").val(results[0].productDescription);
                   $("#txtMemberDescription").val(results[0].memberDescription);
                   $("#txtFinancingAndRevenue").val(results[0].financingAndRevenue);
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

               $("#startTime,#endTime").scroller({
                   preset: 'date',
                   theme: "default",
                   mode: "scroller",
                   display: "bottom",
                   animate: "fade",
                   dateFormat: "yy-mm-dd"
               });

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

/*******退回修改结束*******/