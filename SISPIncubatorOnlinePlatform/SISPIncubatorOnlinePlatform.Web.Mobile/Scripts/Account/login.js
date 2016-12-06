/// <reference path="E:\Project\SispOnlinePlatform\04-Development\Source\SISPIncubatorOnlinePlatform\SISPIncubatorOnlinePlatform.Web.Mobile\Account/register.html" />
/// <reference path="E:\Project\SispOnlinePlatform\04-Development\Source\SISPIncubatorOnlinePlatform\SISPIncubatorOnlinePlatform.Web.Mobile\Account/register.html" />
function Login() {
    if (!LoginCheck()) {
        ShowLoading();
        var authInfo = {
            "mobile": $("#txtMobile").val(),
            "password": $("#txtPassword").val()
        };
        var parameterJson = JSON.stringify(authInfo);
        $.ajax({
            type: "post",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            url: "/api/proxy/auth",
            data: parameterJson,
            success: function (result) {
                $.ajax({
                    type: "get",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    url: "/api/proxy/currentuser",
                    success: function (result) {
                        if (result == null) {
                            $.ajax({
                                type: "post",
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                url: "/api/proxy/auth",
                                data: parameterJson,
                                success: function (result) {
                                    SaveUserInfo();
                                    SaveKeepAutoLogin();
                                    HideErroeMsg();
                                    var renturnUrl = getUrlParam("returnUrl");
                                    if ($.trim(renturnUrl) != "" && renturnUrl != null) {
                                       window.location.href = renturnUrl;
                                    } else {
                                       window.location.href = "../Home.html";
                                    }
                                },
                                error: function (err) {
                                    ErrorResponse(err);
                                }
                            });
                        }
                        else {
                            SaveUserInfo();
                            SaveKeepAutoLogin();
                            HideErroeMsg();
                            var renturnUrl = getUrlParam("returnUrl");
                            if ($.trim(renturnUrl) != "" && renturnUrl != null) {
                               window.location.href = renturnUrl;
                            } else {
                               window.location.href = "../Home.html";
                            }
                            AddLoginLog(1);
                        }
                    }
                });
            },
            error: function (err) {
                ErrorResponse(err);
            }
        });
    }

}
function FindPasswordRedirect() {

   window.location.href = "retrievepassword.html";
}
function RegistrationRedirect() {
   window.location.href = "register.html";
}

function Cancel() {
   window.location.href = "../home.html";
}
//保存用户信息
function SaveUserInfo() {
    var keepPwdClassName = $("#btnKeepPwd").attr('class');
    //如果不包含on,记住密码
    if (keepPwdClassName.indexOf("on") > 0) {
        var mobile = $("#txtMobile").val();
        var passWord = $("#txtPassword").val();
        $.cookie("rmbUser", "true", { path: '/', expires: 7 });
        $.cookie("mobile", mobile, { path: '/', expires: 7 });
        $.cookie("passWord", passWord, { path: '/', expires: 7 });
    }
}

function KeepPwd() {
    var keepPwdClassName = $("#btnKeepPwd").attr('class');
    //如果不包含on,记住密码
    var mobile = $("#txtMobile").val();
    var passWord = $("#txtPassword").val();
    if ($.trim(mobile) != "") {
        if (keepPwdClassName.indexOf("on") < 0) {

            $.cookie("rmbUser", "true", { path: '/', expires: 7 });
            $.cookie("mobile", mobile, { path: '/', expires: 7 });
            $.cookie("passWord", passWord, { path: '/', expires:7 });
        } else {
            $.cookie("rmbUser", '', { path: "/", expires: -1 });
            $.cookie("mobile", '', { path: "/", expires: -1 });
            $.cookie("passWord", '', { path: "/", expires: -1 });
        }
    }
}

function KeepAutoLogin() {
    var keepPwdClassName = $("#btnAutoLogin").attr('class');
    var mobile = $("#txtMobile").val();
    var passWord = $("#txtPassword").val();
    //如果不包含on,记住自动登陆
    if ($.trim(mobile) != "") {
        if (keepPwdClassName.indexOf("on") < 0) {
            $.cookie("rmbUserAuto", "true", { path: '/', expires: 7 });
        } else {
            $.cookie("rmbUserAuto", '', { path: "/", expires: -1 });
        }
    }
}
function SaveKeepAutoLogin() {
    var keepPwdClassName = $("#btnAutoLogin").attr('class');
    if (keepPwdClassName.indexOf("on") > 0) {
        $.cookie("rmbUserAuto", "true", { path: '/', expires: 7 });
    }
}
function AutoLogin() {
    ///自动登陆
    var keepPwdClassName = $("#btnKeepPwd").attr('class');
    var autoLoginClassName = $("#btnAutoLogin").attr('class');
    if (keepPwdClassName.indexOf("on") > 0 && autoLoginClassName.indexOf("on") > 0) {
        Login();
    }
}

function InitData() {
    ///如果是记住用户
    if ($.cookie("rmbUser") == "true") {
        $("#btnKeepPwd").addClass("on");
        $("#txtMobile").val($.cookie("mobile"));
        var pwd = $.cookie("passWord");
        if (pwd && pwd != 'null') {
            $("#txtPassword").val(pwd);
        }
    }

    if ($.cookie("rmbUserAuto") == "true") {
        $("#btnAutoLogin").addClass("on");
        return true;
    }
    return false;
}

//页面加载
$(function () {
    //注册页面返回标识
    $.cookie("regback", "false", { path: '/', expires: 7 });
    //初始化数据
    if (InitData()) {
        //自动登陆
        AutoLogin();
    }
});


function ShowErrorMsg(msg) {
    $("#divError").show();
    $("#divErrorMsg").html(msg);
}
function HideErroeMsg() {
    $("#divError").hide();
    $("#divErrorMsg").html("");
}


function LoginCheck() {
    if ($("#txtMobile").val() == "") {
        if ($("#txtPassword").val() == "") {
            $(".alertTxt").text("请输入手机号和密码");
            $(".alertBox").fadeIn(400);
            setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            return true;
        } else {
            $(".alertTxt").text("请输入手机号");
            $(".alertBox").fadeIn(400);
            setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            return true;
        };
    };
    if ($("#txtPassword").val() == "") {
        if ($("#txtMobile").val() == "") {
            $(".alertTxt").text("请输入手机号和密码");
            $(".alertBox").fadeIn(400);
            setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            return true;
        } else {
            $(".alertTxt").text("请输入密码");
            $(".alertBox").fadeIn(400);
            setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            return true;
        };
    };
    return false;
}

///记录登陆日志
function AddLoginLog(type) {
    var parameter = {
        LoginStatsus: type
    }
    var jsonData = JSON.stringify(parameter);

    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/loginlog",
        data: jsonData,
        success: function (result) {

        },
        error: function (err) {

        }
    });
}