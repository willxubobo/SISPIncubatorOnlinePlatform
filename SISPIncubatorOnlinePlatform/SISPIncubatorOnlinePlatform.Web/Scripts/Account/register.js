//弹出注册
function showregister() {
    $(".logindiv").hide();//隐藏登录
    $(".registerdiv").show();
}
//不同意协议无法提交
function cansubmit(obj) {
    if ($(obj).is(":checked")) {
       // $(".regbtn").removeAttr("disabled");
        $(".regbtn").removeClass("grayBtn");
        $(".regbtn").removeAttr("disabled");
    } else {
        $(".regbtn").addClass("grayBtn");
        $(".regbtn").css("cursor", "default");
        $(".regbtn").prop("disabled", "disabled");
    }
}

//返回登录页
function backlogin() {
    $(this).loginconfirmPC();
    $(".registerdiv").hide();
}

//提交注册
function PostRegister() {
    var cansubmit = false;
    var logourl = $.trim($("#hidlogourl").val());
    //if (logourl == "") {
    //    $(".logotip").show();
    //    cansubmit = true;
    //} else {
    //    $(".logotip").hide();
    //}
    if (!checkarearequire("registerdiv")) {
        cansubmit = true;
    }
    var comname = $.trim($(".CompanyName").val());
    var filelinense = $.trim($("#filelinense").val());
    var filecard = $.trim($("#filecard").val());    
    var UserType = $('.hidutype').val();
    if (UserType == "企业") {
        if (comname == "") {
            $(".CompanyNameTip").show();
            cansubmit = true;
        } else {
            $(".CompanyNameTip").hide();
        }
        if (filelinense == "") {
            $(".comLicenselogo").show();
            cansubmit = true;
        } else {
            $(".comLicenselogo").hide();
        }
        if (filecard == "") {
            $(".comcardlogo").show();
            cansubmit = true;
        } else {
            $(".comcardlogo").hide();
        }
    }
    if (cansubmit) {
        return false;
    }
    ShowLoading();
    
    var UserName = $.trim($(".UserName").val());

    var mobile = $.trim($(".Mobile").val());

    var email = $.trim($(".Email").val());

    var pwd = $.trim($(".Password").val());

    var code = $.trim($(".Code").val());

    var wOpenID = $(".hidopenid").val();
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
                "Address": Address,
                "LogoUrl":$("#hidlogourl").val()
            },
            "WeChat" :{
                Nickname: UserName,
                Headimgurl: logourl,
                OpenID: wOpenID
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
            if (UserType == "企业") { //上传附件
                UploadComInfo(result);
            } else {
                HideLoading();
                $(this).alert("注册成功！");
                $(this).loginconfirmPC();
                $(".registerdiv").hide();
            }
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//企业类型上传附件
function UploadComInfo(userid) {
    var comname = $.trim($(".CompanyName").val());
    var descript = $.trim($(".Description").val());
    $.ajaxFileUpload({
        url: '/api/proxy/uploadregcompanyfile', //用于文件上传的服务器端请求地址
        contentType: "application/json; charset=utf-8",
        secureuri: false, //一般设置为false
        fileElementId: "filelinense;filecard", //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'json', //返回值类型 一般设置为json
        type: 'post',
        data: { UserID: userid, ComName: comname, ComDesc: descript },
        success: function (data, status) //服务器成功响应处理函数
        {
            HideLoading();
            $(this).alert("注册成功");
            $(this).loginconfirmPC();
            $(".registerdiv").hide();

        },
        error: function (data, status, e) //服务器响应失败处理函数
        {
            $(this).alert(e);
        }
    });
}
function SendValidateCode() {
    var mobile = $.trim($(".Mobile").val());
    if (mobile == "") {
        $(".Mobile").next().html("手机号不能为空");
        $(".Mobile").next().show();
        $(".Mobile").focus();
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