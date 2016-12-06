
//登陆验证
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
//登陆
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
                                    var renturnUrl = getUrlParam("returnUrl");
                                    if ($.trim(renturnUrl) != "" && renturnUrl != null) {
                                        window.location.href = renturnUrl;
                                    } else {
                                        window.location.href = "../admin.html";
                                    }
                                },
                                error: function (err) {
                                    ErrorResponse(err);
                                }
                            });
                        }
                        else {
                            var renturnUrl = getUrlParam("returnUrl");
                            if ($.trim(renturnUrl) != "" && renturnUrl != null) {
                                window.location.href = renturnUrl;
                            } else {
                                window.location.href = "../admin.html";
                            }
                        }
                    }
                });
                HideLoading();
            },
            error: function (err) {
                ErrorResponse(err);
            }
        });
    }
}

$(function() {
    $("body").bind('keyup', function(event) {
        if (event.keyCode == 13) {
            Login();
        }
    });
});
