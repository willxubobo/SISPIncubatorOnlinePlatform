function update() {
    var formObj = {
        "User": {
            "Password": $("#txtRetPassword").val(),
            "Mobile": $.trim($("#txtRetMobile").val())

        },
        "PropertyName": "Password"
    };
    var parameter = {
        requestUri: "/api/user",
        requestParameters: formObj
    }

    var modifyPasswordJson = JSON.stringify(parameter);
    $.ajax({
        type: "patch",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/patch/anonymous",
        data: modifyPasswordJson,
        success: function () {
            $(this).alert("密码修改成功！");
            $.cookie("mobile", $.trim($("#txtRetMobile").val()));
            ClearInitLogin();
            ClearRetrieveForm();
            setTimeout(function () { $("#retrievePwdDiv").hide(); $(this).loginconfirmPC(); }, 2000);
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function submitRePwd() {
    if (!checkarearequire("retrievePwdDiv")) {
        return false;
    }
    var txtVerifyCode = $.trim($("#txtRetVerifyCode").val());
    var txtMobile = $.trim($("#txtRetMobile").val());
    var formObj = {
        "SMSValidateCode": {
            "Code": txtVerifyCode,
            "Mobile": txtMobile
        }
    };
    var parameter = {
        requestUri: "/api/validatecode/check",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result.validateCodeRight == "Right") {
                update();
            }
            else {
                $(this).alert("验证码错误!");
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function sendReMessage() {
    var mobile = $.trim($("#txtRetMobile").val());
    if (mobile == "") {
        $("#txtRetMobile").next().html("手机号码不能为空");
        $("#txtRetMobile").next().show();
        return false;
    }
    if (!checkphone(mobile)) {
        $("#txtRetMobile").next().html("手机号码格式不正确");
        $("#txtRetMobile").next().show();
        $("#txtRetMobile").val("");
        $("#txtRetMobile").focus();
        return false;
    } else {
        CheckPhone(mobile);
    }
}

function sendCode() {
    var formObj = {
        "SMSValidateCode": {
            "Mobile": $("#txtRetMobile").val()
        }
    }
    var parameter = {
        requestUri: "/api/validatecode",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function () {
            $(this).alert("发送验证码成功，请注意查收！");
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function CheckPhone(mobile) {
    var parameter = {
        "requestUri": "/api/user/check",
        "requestParameters": {
            "Mobile": mobile
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
            var time = 60;
            function timeCountDown() {
                if (time == 0) {
                    clearInterval(timer);
                    $('.authCodeBtn').removeClass('grayBtn').removeAttr("disabled").html("发送验证码").next(".shadeBtn").removeClass("disabledBtn");
                    return true;
                }
                $('.authCodeBtn').addClass('grayBtn').html(time + "S后再次发送").next(".shadeBtn").addClass("disabledBtn");
                //.porp("disabled", "disabled")
                time--;
                return false;
            }
            timeCountDown();
            var timer = setInterval(timeCountDown, 1000);
            sendCode();
        },
        error: function (result) {
            $("#txtRetMobile").next().html("手机号码不存在，请核对后重新输入！");
            $("#txtRetMobile").next().show();
        }
    });
}

function CancelRePwd() {
    $("#txtRetMobile").val("");
    $("#txtRetVerifyCode").val("");
    $("#txtRetPassword").val("");
    $("#txtConfirmPassword").val("");
    $("#retrievePwdDiv").hide();
    $("#divPhone").hide();
    $("#divVerifyCode").hide();
    $("#divPassword").hide();
    $("#divConfirmPassword").hide();
    $(this).loginconfirmPC();
}

function ClearRetrieveForm() {
    $("#txtRetMobile").val("");
    $("#txtRetVerifyCode").val("");
    $("#txtRetPassword").val("");
    $("#txtConfirmPassword").val("");
    $("#retrievePwdDiv").hide();
    $("#divPhone").hide();
    $("#divVerifyCode").hide();
    $("#divPassword").hide();
    $("#divConfirmPassword").hide();
}

function ShowRePwd()
{
    $(".logindiv").hide();
    $("#retrievePwdDiv").show();
    popup();
}