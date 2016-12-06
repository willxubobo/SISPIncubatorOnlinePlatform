function update() {
    ShowLoading();
    var formObj = {
        "User": {
            "Password": $("#txtPassword").val(),
            "Mobile": $.trim($("#txtMobile").val())

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
            ClearInitLogin();
            setTimeout(function () { window.location.href = "http://" + window.location.host + "/account/login.html"; }, 2000);
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function SubmitRetrivevPassword() {
    if (!checkrequire()) {
        return false;
    }
    ShowLoading();
    var txtVerifyCode = $.trim($("#txtVerifyCode").val());
    var txtMobile = $.trim($("#txtMobile").val());
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
            
            HideLoading();
        },
        error: function(result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function sendMessage() {
    var mobile = $.trim($("#txtMobile").val());
    if (mobile == "") {
        $("#txtMobile").next().html("手机号不能为空");
        $("#txtMobile").next().show();
        return false;
    }
    if (!checkphone(mobile)) {
        $("#txtMobile").next().html("手机号格式不正确");
        $("#txtMobile").next().show();
        $("#txtMobile").val("");
        $("#txtMobile").focus();
        return false;
    } else {
        CheckPhone(mobile);
    }
}

function sendCode() {
        var formObj = {
        "SMSValidateCode": {
            "Mobile": $("#txtMobile").val()
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
            $("#txtMobile").next().html("手机号不存在，请核对后重新输入！");
            $("#txtMobile").next().show();
        }
    });
}

