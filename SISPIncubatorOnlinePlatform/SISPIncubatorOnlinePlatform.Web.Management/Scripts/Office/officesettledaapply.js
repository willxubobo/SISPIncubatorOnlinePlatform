
$(function () {
    //if(!CheckUserLogin())return;
    CheckUserLogin();
    InitFormData();
});

//初始化页面表单数据
function InitFormData() {
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

    $(".rdSex").on("click", function() {
        $(".rdSex").removeClass("on");
        $(this).addClass("on");
    });

    InitLayDate();
}

//初始化日期
var start;
var end;
function InitLayDate() {
    laydate.skin('custom');//切换皮肤，请查看skins下面皮肤库
    start = {
        elem: '#txtStartDate', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: '1900/01/01', //最小日期
        max: laydate.now(), //最大日期
        start: laydate.now(),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            end.min = dates;
            end.start = dates;
            $("#txtStartDate").next().hide();
        }
    }
    end = {
        elem: '#txtEndDate', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: '1900/01/01', //最小日期
        max: laydate.now(), //最大日期
        start: laydate.now(),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            start.max = dates;
            $("#txtEndDate").next().hide();
        }
    };
    laydate(start);
    laydate(end);
}

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
    $(".divWorkTips").hide();
    $(".divWorkTips").html("学校或工作单位不能为空！");
    var a16 = true;
    if ($(".divItem").length <= 0) {
        $(".divWorkTips").show();
        a16 = false;
    }

    if ($(".divItem").length > 5 || $(".divItem").length < 3) {
        $(".divWorkTips").html("学校或工作单位至少三行，最多五行");
        $(".divWorkTips").show();
        a16 = false;
    }
    if (!checkarearequire("divContent") || !a16) return;

    var applyId = $("#hidApplyId").val();

    ShowLoading();
    //提交，再次提交
    if ($.trim(applyId) != "") {
        ReSubmitAndSaveForm();
    }
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
        ApplyStatus: "resubmit",
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
               $(this).alert('保存成功');
               setTimeout(function () {
                   location.href = 'manageOffice.html';
               }, 2000);

           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//获取性别
function GetGender() {
    var boyCheck = $(".boy.on");
    if (boyCheck.length > 0) {
        return "1";
    }
    return "0";
}

//页面取消
function CancelPage() {
    window.location.href = '../home.html';
}
/******/
//打开弹出层
function ShowWorkExperience() {
    $(".addContentArea").show();
    $(".addBtnArea").hide();
}
//隐藏弹出层
function HideWorkExperience() {
    $(".addContentArea").hide();
    $(".addBtnArea").show();

    $("#txtStartDate").next().hide();
    $("#txtEndDate").next().hide();
    $("#txtWorkAddress").next().hide();

    $(".ad").show();
    $(".ae").show();
}
//取消按钮
function CancelWorkExperience() {
    ClearData();
    HideWorkExperience();
}
//清空弹出层的数据
function ClearData() {
    $("#txtStartDate").val("");
    $("#txtEndDate").val("");
    $("#txtWorkAddress").val("");
    $("#txtPosition").val("");
    $("#hidOperator").val("add");
    $("#hidId").val("");
}
//验证弹出层的数据
function ValidationStartDate() {
    var startDate = $("#txtStartDate");
    if ($.trim(startDate.val()) == "") {
        startDate.next().show();
        return true;
    } else {
        startDate.next().hide();
        return false;
    }
}

function ValidationEndDate() {
    var endDate = $("#txtEndDate");
    if ($.trim(endDate.val()) == "") {
        endDate.next().show();
        return true;
    } else {
        endDate.next().hide();
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


//确定新增
function SaveOk() {

    var a = ValidationStartDate();
    var b = ValidationEndDate();
    var c = ValidationWorkLayer();

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
                detailArry[l].startDate = $("#txtStartDate").val();
                detailArry[l].endDate = $("#txtEndDate").val();
                detailArry[l].workAddress = $("#txtWorkAddress").val();
                detailArry[l].position = $("#txtPosition").val();
            }
        }
    } else {
        var radom = MathRand(10);
        var startDate = $("#txtStartDate").val();
        var endDate = $("#txtEndDate").val();
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

    CancelWorkExperience();

    $(".divWorkTips").hide();
}
///删除工作经历
function DelItem(obj) {
    var index = $(".divItem").index($(obj).closest(".divItem"));
    $("#hidIndex").val(index);
    OpenConfirm();
    //$(obj).parent().parent().remove();
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
        if (k == 0) {
            html += "<div class=\"divItem\" >";
        } else {
            html += "<div class=\"divItem\" style='position: relative;border-bottom: 1px dashed #e7e9ef; margin-bottom: 20px;'>";
        }

        html += " <div class=\"module-worktitle\">" + detailArry[k].startDate + "至" + detailArry[k].endDate + "</div>";
        html += "<div class=\"module-txt\">";
        html += detailArry[k].workAddress;
        if ($.trim(detailArry[k].position) != "") {
            html += "【" + detailArry[k].position + "】";
        }
        html += "</div><div class=\"module-operate\" style='padding-bottom: 10px;overflow: hidden;'>";
        html += "<a class=\"module-workbtn right remove-btn ad\" title='删除' onclick='DelItem(this);' ></a>";
        html += "<a class=\"module-workbtn right edit-btn right20 ae\" title='编辑' onclick='Modify(this)'></a><input  value='" + dataStr + "' class=\"hidValue\" type=\"hidden\" />";
        html += " </div>";
        html += "</div>";

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
    $("#txtStartDate").val(arrayItem[1]);
    $("#txtEndDate").val(arrayItem[2]);
    $("#txtWorkAddress").val(arrayItem[3]);
    $("#txtPosition").val(arrayItem[4]);
    $("#hidOperator").val("modify");

    $(obj).hide();
    $(obj).prev().hide();

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



               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

/*******退回修改结束*******/

//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidIndex").val("");
}
//打开撤销确认对话框
function OpenConfirm() {
    $(".divConfirm").show();
}
//删除某项工作经历
function DeleteWorkEx() {
    var index = $("#hidIndex").val();
    if ($.trim(index) != "") {
        $($(".divItem")[index]).remove();
    }
    CloseConfirm();
}