$(function () {
    CheckUserLogin();
    InitIndustryCheckBox();
    InitLayDate();
});

function InitIndustryCheckBox() {
    var dictionary = {
        Key: "Industry"
    }
    var parameter = {
        requestUri: "/api/informations",
        requestParameters: dictionary
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                var data = result.results;
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<div class='checkDiv'><input class='baseCheckBox' type='checkbox' name='Industry' value=" + data[i].id + " /><label class='checkBoxTxt'>" + data[i].value + "</label></div>";
                }
                $("#industry").append(html);
                $("[name='Industry']:checkbox").each(function () {
                    $(this).click(function () {
                        if ($("input[name='Industry']:checked").length > 0) {
                            $("#industryfailInfo").hide();
                        }
                    });
                });
                var serviceId = getUrlParam("id");
                if (serviceId != null && serviceId != "") {
                    GetInfo(serviceId);
                }
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function GetInfo(serviceId) {
    ShowLoading();
    var parameter = {
        "requestUri": "/api/servicepublish/" + serviceId,
        "requestParameters": {

        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get",
        data: parameterJson,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                $("#companyName").val(result.results[0].companyName);
                $("#phone").val(result.results[0].phoneNumber);
                $("#email").val(result.results[0].email);
                $("#address").val(result.results[0].address);
                $("#description").val(result.results[0].description);
                $("#status").val(result.results[0].status);
                var categoryVal = result.results[0].category;
                $("#div_publishCategory").find("input[type='radio'][value='" + categoryVal + "']").prop("checked", "checked");
                //if (result.results[0].category == "服务") {
                //    $("#server").addClass("on");
                //    $("#technology").removeClass("on");
                //} else {
                //    $("#technology").addClass("on");
                //    $("#server").removeClass("on");
                //}
                if (result.results[0].isShow) {
                    $("#isShow").prop("checked", true);
                }
                else {
                    $("#isShow").prop("checked", false);
                }
                var industry = result.results[0].industry;
                if (industry != "") {
                    var industryArry = industry.split(",");
                    for (var i = 0; i < industryArry.length; i++) {
                        $("input[value='" + industryArry[i] + "']").prop("checked", true);
                    }
                }

                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#endTime").val("");
                    $("#hiddenEndTime").val("");
                }
                else {
                    $("#endTime").val(result.results[0].expiryDate.substr(0, 10));
                    $("#hiddenEndTime").val(result.results[0].expiryDate.substr(0, 10));
                }
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function PostServicePublish() {
    if (!checkarearequire("main-content")) {
        return false;
    }
    var industry = "";
    $("#industry :checked").each(function () {
        industry += $(this).val() + ",";
    });
    if (industry != "") {
        industry = industry.substring(0, industry.length - 1);
    } else {
        $("#industryfailInfo").show();
        return false;
    }
    ShowLoading();
    var companyName = $.trim($("#companyName").val());
    var email = $.trim($("#email").val());
    var phone = $.trim($("#phone").val());
    //var category = $(".registerRadio.on").val();
    var category = $("#div_publishCategory").find("input[type='radio']:checked").val();
    var serviceId = getUrlParam("id");
    var address = $.trim($("#address").val());
    var description = $.trim($("#description").val());
    var isShow = $("#isShow").prop("checked");
    var status = $.trim($("#status").val());
    var expiryDate = $.trim($("#hiddenEndTime").val());

    var servicePublish = {
            ServiceID: serviceId,
            CompanyName: companyName,
            Industry: industry,
            Address: address,
            Email: email,
            Description: description,
            Category: category,
            PhoneNumber: phone,
            Status:status,
            IsShow: isShow,
            ExpiryDate: expiryDate
        };

    var formObj = {
        "ServicePublish": servicePublish,
        "IsAdmin":true
    };
    var parameter = {
        requestUri: "/api/servicePublish",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    var submiturl = "/api/proxy/put";
    if (serviceId == null || serviceId == "") {
        submiturl = "/api/proxy/post";
    }
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function () {
            $(this).alert("提交成功！");
            setTimeout(function () {
                window.opener.IniServiceData();
                window.close();
            }, 2000);
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function ServiceCancel() {
    window.close();
}
function InitLayDate() {
    laydate.skin('custom');//切换皮肤，请查看skins下面皮肤库
    laydate({
        elem: '#endTime', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: laydate.now(1), //最小日期
        max: '2999-01-01', //最大日期
        start: laydate.now(90),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            $("#endTimefailInfo").hide();
            $("#hiddenEndTime").val(dates);
        }
    });
}