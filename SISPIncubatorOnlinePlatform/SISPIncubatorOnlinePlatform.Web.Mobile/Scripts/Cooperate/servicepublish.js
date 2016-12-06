$(function () {
    CheckUserLogin();
    InitIndustryCheckBox();
    $("#expiryDate").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        maxDate: new Date(new Date().getFullYear() + 3, new Date().getMonth(), new Date().getDate()),
        onSelect: function (valueText, inst) {
            $(this).next().hide();
        }
    });
});

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
            if (result != null && result.results.length > 0) {
                $("#companyName").val(result.results[0].companyName);
                $("#phone").val(result.results[0].phoneNumber);
                $("#email").val(result.results[0].email);
                $("#address").val(result.results[0].address);
                $("#description").val(result.results[0].description);
                var categoryVal = result.results[0].category;
                $("#div_publishCategory").find("input[type='radio'][value='" + categoryVal + "']").prop("checked", "checked");
                //if (result.results[0].category == "服务") {
                //    $("#server").addClass("on");
                //    $("#technology").removeClass("on");
                //} else {
                //    $("#technology").addClass("on");
                //    $("#server").removeClass("on");
                //}
                var industry = result.results[0].industry;
                if (industry != "") {
                    var industryArry = industry.split(",");
                    for (var i = 0; i < industryArry.length; i++) {
                        $("input[value='" + industryArry[i] + "']").prop("checked", true);
                    }
                }
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").val("有效时间：");
                }
                else {
                    $("#expiryDate").val("有效时间：" + result.results[0].expiryDate.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
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
    if (!checkrequire()) {
        return false;
    }
    ShowLoading();
    var companyName = $.trim($("#companyName").val());
    var industry = $.trim($("#industry").val());
    var email = $.trim($("#email").val());
    var phone = $.trim($("#phone").val());
    var category = $("#div_publishCategory").find("input[type='radio']:checked").val();
    var serviceId = getUrlParam("id");
    var address = $.trim($("#address").val());
    var description = $.trim($("#description").val());
    var expiryDate = $.trim($("#expiryDate").val());

    var servicePublish = {
        ServiceID:serviceId,
        CompanyName: companyName,
        Industry: industry,
        Address: address,
        Email: email,
        Description: description,
        Category: category,
        PhoneNumber: phone,
        Status:"1",
        ExpiryDate: expiryDate
    };
    var formObj = {
        "ServicePublish": servicePublish
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
            gotosuccesspage();
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function InitIndustryCheckBox() {
    ShowLoading();
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
            if (result != null && result.results.length > 0) {
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
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}