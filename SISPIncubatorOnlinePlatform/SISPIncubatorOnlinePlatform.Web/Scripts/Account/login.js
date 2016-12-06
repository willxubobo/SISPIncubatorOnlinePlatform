/// <reference path="E:\Project\SispOnlinePlatform\04-Development\Source\SISPIncubatorOnlinePlatform\SISPIncubatorOnlinePlatform.Web.Mobile\Account/register.html" />
/// <reference path="E:\Project\SispOnlinePlatform\04-Development\Source\SISPIncubatorOnlinePlatform\SISPIncubatorOnlinePlatform.Web.Mobile\Account/register.html" />
function Login(callback) {   
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
                $("body").css("overflow", "");
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
                                        location.href = renturnUrl;
                                    } else {
                                        InitUserData_Home();
                                    }
                                    $("#logOut").show();
                                    $("#Login").hide();
                                    if (callback) {
                                        var func = eval(callback);
                                        new func();
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

                            AddLoginLog(1);

                            var renturnUrl = getUrlParam("returnUrl");
                            if ($.trim(renturnUrl) != "" && renturnUrl != null) {
                                location.href = renturnUrl;
                            } else {
                                InitUserData_Home();
                            }

                            if (callback) {
                                var func = eval(callback);
                                new func();
                            }
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

var qrcodetimer;
//登录成功后加载用户信息
function InitUserData_Home() {  
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",
        //data: parameterJson,
        success: function (result) {
            if (result == null) {
                GetQrData();
                qrcodetimer=setInterval('GetSubscribe()', 2000);
                //$(this).alert("加载用户信息失败！");
            } else {
                clearInterval(qrcodetimer);
                $(".logindiv").hide();
                $("#imglogo_l").hide();
                $("#Login").hide();              
                $("#logOut").html("<span onclick=\"myprofile();\">" + result.userName + "</span>|<span  onclick=\"OpenlogOutConfirm();\">退出</span>").show();
                $("#userlogo").show();
                //$("#userlogo").attr("src", result.avatar).attr("onclick", "myprofile();");
                //$("#imglogo_l").attr("src", result.avatar);
                $(".weChatImgContent").hide();
                $(".webuserlogonewdiv").show();
                $(".webuserlogoshade").attr("onclick", "myprofile();");
                $("#webuserlogonew").attr("src", result.avatar);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
//退出确认
function OpenlogOutConfirm() {
    $(".divlogOutConfirm").show();
}
//取消退出
function CloselogOutConfirm() {
    $(".divlogOutConfirm").hide();
}
//跳转到个人中心
function myprofile() {
    location.href = window.location.protocol + "//" + window.location.host + "/Account/myprofile.html";
}
function FindPasswordRedirect() {

    location.href = "retrievepassword.html";
}
function RegistrationRedirect() {
    //location.href = "register.html";
}

function Cancel() {
    $(".logindiv").hide();
   // $("body").css("overflow", "");
    $("html").css("overflow", "auto").removeClass("fancybox-margin");
    //location.href = "../home.html";
}
//保存用户信息
function SaveUserInfo() {
    var keepPwdClassName = $("#btnKeepPwd").is(':checked');
    //如果不包含on,记住密码
    if (keepPwdClassName) {
        var mobile = $("#txtMobile").val();
        var passWord = $("#txtPassword").val();
        $.cookie("rmbUser", "true", { expires: 7 });
        $.cookie("mobile", mobile, { expires: 7 });
        $.cookie("passWord", passWord, { expires: 7 });
    }
}

function KeepPwd() {
    var keepPwdClassName = $("#btnKeepPwd").is(':checked');
    //如果不包含on,记住密码
    var mobile = $("#txtMobile").val();
    var passWord = $("#txtPassword").val();
    if ($.trim(mobile) != "") {
        if (keepPwdClassName) {

            $.cookie("rmbUser", "true", { path: '/', expires: 7 });
            $.cookie("mobile", mobile, { path: '/', expires: 7 });
            $.cookie("passWord", passWord, { path: '/', expires: 7 });
        } else {
            $.cookie("rmbUser", '', { path: "/", expires: -1 });
            $.cookie("mobile", '', { path: "/", expires: -1 });
            $.cookie("passWord", '', { path: "/", expires: -1 });
        }
    }
}

function KeepAutoLogin() {
    var keepPwdClassName = $("#btnAutoLogin").is(':checked');
    var mobile = $("#txtMobile").val();
    var passWord = $("#txtPassword").val();
    //如果不包含on,记住自动登陆
    if ($.trim(mobile) != "") {
        if (keepPwdClassName) {
            $.cookie("rmbUserAuto", "true", { expires: 7 });
        } else {
            $.cookie("rmbUserAuto", '', { path: "/", expires: -1 });
        }
    }
}
function SaveKeepAutoLogin() {
    var keepPwdClassName = $("#btnAutoLogin").is(':checked');
    if (keepPwdClassName) {
        $.cookie("rmbUserAuto", "true", { expires: 7 });
    }
}

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
            $(this).alert("请输入手机号和密码");         
            return true;
        } else {
            $(this).alert("请输入手机号");         
            return true;
        };
    };
    if ($("#txtPassword").val() == "") {
        if ($("#txtMobile").val() == "") {
            $(this).alert("请输入手机号和密码");         
            return true;
        } else {
            $(this).alert("请输入密码");
            return true;
        };
    };
    return false;
}

//弹出登录窗口
function ShowLogin() {
    $(this).loginconfirmPC();
    popup();
}

//微信登录二维码
function InitQrCode(url) {
    $("#imglogo").attr("src", url);
}

function LogOut() {
    $.ajax({
        type: "post",
        url: "/api/proxy/logout",
        success: function () {
            ClearInitLogin();       
            $("#logOut").hide();
            $("#Login").show();
            window.location.href = window.location.protocol + "//" + window.location.host + "/home.html";
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

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