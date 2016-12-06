$(function () {
    if ($.cookie("regback") != "" && $.cookie("regback")=="true") {
       window.location.href = "login.html";
    }
    createCode();
    var Code = getUrlParam("code");
    if (Code == null || Code == undefined || Code == "") {
    var rurl =window.location.href.split('?')[0];
    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7d4624213de76285&redirect_uri=" + encodeURI(rurl) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    } else {
        ShowLoading();
        GetNickName();
    }
});
var weChat = {};//保存微信信息
//获取用户微信昵称
function GetNickName() {
    var cando = true;
    if (cando) {
        var Code = getUrlParam("code");
        var purl =window.location.href.split('?')[0];
        var parameter = {
            "requestUri": "/api/weixin",
            "requestParameters": {
                "PageUrl": purl,
                "Code": Code
            }
        };
        var parameterJson = JSON.stringify(parameter);
        $.ajax({
            type: "post",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            url: "/api/proxy/post/anonymous",
            data: parameterJson,
            success: function(result) {
                if (result.redirectUrl != null && result.redirectUrl != undefined && result.redirectUrl != "") {
                   window.location.href = result.redirectUrl;
                } else {
                    $.cookie("regback", "true", { path: '/', expires: 7 });
                    $(".nickname").val(result.nickname);
                    weChat = {
                        Country: result.country,
                        Province: result.province,
                        City: result.city,
                        Sex: result.sex,
                        Nickname: result.nickname,
                        Headimgurl: encodeURIComponent(result.headimgurl),
                        OpenID:result.openID
                    };
                }
                HideLoading();
            },
            error: function(result) {
                ErrorResponse(result);
            }
        });
    }
}

function checkcomname() {
    var comname = $.trim($(".CompanyName").val());
    if (comname == "") {
        $(".CompanyNameTip").show();
    } else {
        $(".CompanyNameTip").hide();
    }
}
//返回登录页
function backlogin() {
    window.location.href = "login.html";
}
//提交注册
function PostRegister() {    
    if (!checkrequire()) {
        return false;
    }
    var UserName = $.trim($(".UserName").val());    
    var mobile = $.trim($(".Mobile").val());
    var email = $.trim($(".Email").val());    
    var pwd = $.trim($(".Password").val());    
    var code = $.trim($(".Code").val());
    var UserType = $('.hidutype').val();
    var comname = $.trim($(".CompanyName").val());
    var localid = $.trim($(".hidlocalid").val());
    var medid = $.trim($(".hidmedid").val());
    var cardlocalid = $.trim($(".hidcardlocalid").val());
    var cardmedid = $.trim($(".hidcardmedid").val());
    var descript = $.trim($(".Description").val());
    if (UserType == "企业") {
        if (comname == "") {
            $(".CompanyNameTip").show();
            return false;
        } else {
            $(".CompanyNameTip").hide();
        }
        if (localid == "") {
            $(".comLicenselogo").show();
            return false;
        } else {
            $(".comLicenselogo").hide();
        }
        if (medid == "") {
            $(this).alert("公司营业执照图片未上传成功无法提交！");
            return false;
        }
        if (cardlocalid == "") {
            $(".comcardlogo").show();
            return false;
        } else {
            $(".comcardlogo").hide();
        }
        if (cardmedid == "") {
            $(this).alert("身份证图片未上传成功无法提交！");
            return false;
        }
    }
    ShowLoading();
    var savepath = "CompanyFolder";
    var fname = guid();
    var cardfilename=guid();
    var weixin = {
        SavePath: savepath,
        MediaID: medid+","+cardmedid,
        FileName: fname+","+cardfilename
    };
    var Address = $.trim($(".Address").val());
    var parameter = {
        "requestUri": "/api/user",
        "requestParameters": {
            "Code": code,
            "RegSource": "mobile",
            "User": {
                "UserName": UserName,
                "Mobile": mobile,
                "Email": email,
                "Password": pwd,
                "UserType": UserType,
                "Address": Address
            },
            "WeChat": weChat,
            "WeiXinRequest": weixin,
            "UserExtension": {
                "CompanyName": comname,
                "BusinessLicenseImg": fname,
                "IDCardImg": cardfilename,
                "Description": descript
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
            HideLoading();
            $(this).alert("注册成功！");
            setTimeout(function () {window.location.href = "login.html"; }, 2000);
        },
        error: function (result) {         
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function SendValidateCode() {
    var mobile = $.trim($(".Mobile").val());
    if (mobile == "") {
        $(".Mobile").next().html("手机号不能为空");
        $(".Mobile").next().show();
        return false;
    }
    if ($("#hiddenSendCode").val() == "true") {
        return false;
    }
    if (!checkphone(mobile)) {
        $(".Mobile").next().html("手机号格式不正确");
        $(".Mobile").next().show();
        $(".Mobile").val("");
        $(".Mobile").focus();
        return false;
    } else {
        sendMessage();
        $(".Mobile").next().hide();
    }
    var parameter = {
        "requestUri": "/api/validatecode",
        "requestParameters": {
            "SMSValidateCode": {
                "Mobile": mobile
            }
        }
    };

    //var parameter = '{"SMSValidateCode": {"Mobile":' + phone + '}}';
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}