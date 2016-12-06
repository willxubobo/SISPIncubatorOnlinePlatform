//验证手机号
function checkphone(obj) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return myreg.test(obj);
}
function checkWorkPhone(obj) {
    var myreg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    return myreg.test(obj);
}
//验证邮箱
function checkemail(obj) {
    var emailcheck = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(obj);
    return emailcheck;
}

function checkRegisterPhone(mobile) {
    var result = true;
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
        async: false,
        success: function () {
            result = false;
        },
        error: function (result) {
            result = true;
        }
    });
    return result;
}

//验证密码格式
function CheckPwd(v) {
    var result = "";
    var numasc = 0;
    var charasc = 0;
    if (0 == v.length) {
        result = "密码不能为空!";
    } else if (v.length < 6 || v.length > 20) {
        result = "密码至少6个字符,最多20个字符!";
    } else {
        for (var i = 0; i < v.length; i++) {
            var asciiNumber = v.substr(i, 1).charCodeAt();
            if (asciiNumber >= 48 && asciiNumber <= 57) {
                numasc += 1;
            }
            if ((asciiNumber >= 65 && asciiNumber <= 90) || (asciiNumber >= 97 && asciiNumber <= 122)) {
                charasc += 1;
            }
        }
        if (0 == numasc) {
            result = "密码必须包含数字、字母，区分大小写!";
        } else if (0 == charasc) {
            result = "密码必须包含数字、字母，区分大小写!";
        } 
    }
    return result;
}

var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

function sendMessage() {
    curCount = count;
    //设置button效果，开始计时
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").addClass("grayBtn");
    $("#btnSendCode").val("倒计时" + curCount);
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}

//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").removeClass("grayBtn");
        $("#btnSendCode").val("重新发送");
    }
    else {
        curCount--;
        $("#btnSendCode").val("倒计时" + curCount);
    }
}
//onfocus
function focusdo(obj, v) {
    $(obj).css("color", "#000");
    if ($.trim($(obj).val()) == v) {
        $(obj).val("");
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//个人，企业
function settype(obj) {
    $(".hidutype").val(obj);
    if (obj == "企业") {
        if ($(".companyuser").length > 0) {
            $(".companyuser").show();
        }
    } else {
        if ($(".companyuser").length > 0) {
            $(".companyuser").hide();
        }
    }
}

//只能输入数字和小数点
function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  

    obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是. 

    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.   

    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

}