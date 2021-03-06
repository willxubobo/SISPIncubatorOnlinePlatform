﻿//取消保存
function cancelsave() {
    window.location.href = "myprofile.html";
}
$(function () {
    ShowLoading();
    GetUserInfo();
   
});

//根据编号获取用户信息
function GetUserInfo() {
    var mobile = getUrlParam("mobile");
    var parameter = {
        "requestUri": "/api/user/" + mobile,
        "requestParameters": {
            "Mobile": mobile
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
            if (result == null) {
                $(this).alert("用户未登录！");
            } else {
                $(".UserNameimp").val(result.user_name);
                $(".hiduserid").val(result.user_id);
                //$(".Mobile").val(result.results[0].mobile);
                $("#divphone").html(result.user_mobile);
                $(".hidphone").val(result.user_mobile);
                $(".Emailimp").val(result.user_email);
                var utype = result.user_type;
                if (utype == "个人") {
                    $(".cptype").html("个人");
                    $(".companyuser").hide();
                    //$(".bussiness").removeClass("on");
                    //$(".person").addClass("on");
                    $(".hidutype").val("个人");
                } else {
                    $(".cptype").html("企业");
                    //$(".bussiness").addClass("on");
                    //$(".person").removeClass("on");
                    $(".hidutype").val("企业");
                    $(".CompanyNameimpro").html(result.user_comname);
                    $(".linenseimg").attr("src", result.user_linenseimg);
                    $(".cardimg").attr("src", result.user_cardimg);
                    $(".Description").html(result.user_desc);
                    $(".companyuser").show();
                }
                $(".Addressimp").val(result.user_address);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//提交修改
function saveform() {
    if (!checkarearequire("webimproveuserinfo")) {
        return false;
    }
    ShowLoading();
    var UserName = $.trim($(".UserNameimp").val());
    var mobile = $.trim($("#divphone").text());
    var fname = guid();
    var email = $.trim($(".Emailimp").val());
    var UserID = $(".hiduserid").val();
    
    var UserType = $('.hidutype').val();

    var Address = $.trim($('.Addressimp').val());
    var frPublish = {
        UserName: UserName,
        Mobile: mobile,
        Email: email,
        UserType: UserType,
        Address: Address,
        UserID: UserID
    };
    var formObj = {
        "Code": "",
        "User": frPublish
    };
    var parameter = {
        requestUri: "/api/user",
        requestParameters: formObj
    }

    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/put",
        data: parameterJson,
        success: function (result) {
            RefreshUser();

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

//保存成功后刷新当前用户信息
function RefreshUser() {
    $.ajax({
        type: "PUT",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/user/refresh",
        success: function (result) {
            $(this).alert("保存成功！");
            setTimeout(function () { window.location.href = "myprofile.html"; }, 2000);
        },
        error: function (result) {
            $(this).alert("保存成功！");
            setTimeout(function () { window.location.href = "myprofile.html"; }, 2000);
            //ErrorResponse(result);
        }
    });
}

function SendValidateCode() {
    var mobile = $.trim($(".Mobile").val());
    if (mobile == "") {
        $(this).alert("手机号不能为空!");
        return false;
    }
    if (!checkphone(mobile)) {
        $(this).alert('请输入有效的手机号码！');
        $(".Mobile").val("");
        $(".Mobile").focus();
        return false;
    } else {
        sendMessage();
    }

    var parameter = {
        "requestUri": "/api/validatecode",
        "requestParameters": {
            "SMSValidateCode": {
                "Mobile": mobile
            }
        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            $(this).alert("发送成功");
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

//验证手机号有没有修改
function checkphonenumber() {
    var phone = $(".hidphone").val();
    var newphone = $.trim($(".Mobile").val());
    if (phone != newphone) {
        return false;
    } else {
        return true;
    }
}

//手机获取焦点事件
function focusphone() {
    if (!checkphonenumber()) {
        $(".codediv").show();
    } else {
        $(".codediv").hide();
    }
}