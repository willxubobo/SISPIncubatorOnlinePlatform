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
$(function () {
    if ($(".enterfunction").length > 0) {
        $("body").bind('keyup', function(event) {
            if (event.keyCode == 13) {
                eval(""+$(".enterfunction").val()+"()");
            }
        });
    }
    if ($(".agreeBtn").length > 0) {
        $(".agreeBtn").click(function() {
            var className = $(this).attr("class");
            if (className.indexOf("on") > 0) {
                $(".blueBtn").removeClass("grayBtn");
                $(".blueBtn").removeAttr("disabled");
            } else {

                $(".blueBtn").addClass("grayBtn");
                $(".blueBtn").attr("disabled", "disabled");
            }
        });
    }

    $(document).find("input").each(function () {
        if ($(this).attr("isrequired") != null && $(this).attr("isrequired") != undefined && $(this).attr("isrequired") != "") {
            $(this).blur(function () {
                var ctype = $(this).attr("ctype");
                var tv = $.trim($(this).val());
                if (tv == "") {
                    var destip = $(this).next().text();
                    if (destip.indexOf('格') != -1) {
                        destip = destip.split('格')[0];
                        $(this).next().html(destip+"不能为空！");
                    }
                    $(this).next().show();
                } else {
                    if (ctype == "Email") {
                        if (!checkemail(tv)) {
                            $(this).next().html("邮箱格式不正确！");
                            $(this).next().show();
                            $(this).focus();
                        } else {
                            $(this).next().hide();
                        }
                    } else if (ctype == "Mobile") {
                        if (!checkphone(tv)) {
                            $(this).next().html("手机号格式不正确！");
                            $(this).next().show();
                        } else {
                            $(this).next().hide();
                        }
                    } else if (ctype == "Phone") {
                        if (!checkWorkPhone(tv)) {
                            var des = "电话号码格式不正确！";
                            if ($(this).attr("des") != null && $(this).attr("des") != undefined && $(this).attr("des") != "") {
                                des = $(this).attr("des");
                            }
                            $(this).next().html(des);
                            $(this).next().show();
                            $(this).focus();
                        } else {
                            $(this).next().hide();
                        }
                    } else if (ctype == "loginpwd") {
                        var rv = CheckPwd(tv);
                        if (rv != "") {
                            $(this).next().html(rv);
                            $(this).next().show();
                        } else {
                            $(this).next().hide();
                        }
                    } else if (ctype == "surepwd") {
                        var pwd = $.trim($("#txtRetPassword").val());
                        if (tv != pwd) {
                            $(this).next().html("登录密码与确认密码不一致！");
                            $(this).next().show();
                        } else {
                            $(this).next().hide();
                        }
                    } else if (ctype == "surepwdreg") {
                        var pwd = $.trim($(".Password").val());
                        if (tv != pwd) {
                            $(this).next().html("登录密码与确认密码不一致！");
                            $(this).next().show();
                        } else {
                            $(this).next().hide();
                        }
                    } else {
                        $(this).next().hide();
                    }
                }
            });
        }
    });
    $(document).find("textarea").each(function () {
        if ($(this).attr("isrequired") != null && $(this).attr("isrequired") != undefined && $(this).attr("isrequired") != "") {
            $(this).blur(function () {
                var tv = $.trim($(this).val());
                if (tv == "") {
                    $(this).next().show();
                } else {
                    $(this).next().hide();
                }
            });
        }
    });
});
//格式化日期
function getNowFormatDate(obj) {
    var date = new Date(obj);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//点击同意
function protocalpage() {
   window.location.href = "../Agreement/publishprotocal.html";
}
//生成guid
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//解析错误信息
function ErrorResponse(obj) {
    var errormes = JSON.parse(obj.responseText);
    var errorcode = errormes.HttpStatusCode;
    if (errorcode == "401" || errorcode == undefined) {
        var locationUrl =window.location.href;
        if (locationUrl.indexOf('login.html') < 0) {
            $(this).loginconfirmPC();
        }
        else {
            if (errormes.Message) {
                $(this).alert(errormes.Message);             
            }
            else {
                $(this).alert(errormes.message);              
            }
        }
    }
    else {
        if (errormes.Message) {
            $(this).alert(errormes.Message);         
        }
        else {
            $(this).alert(errormes.message);           
        }
    }
    HideLoading();
}
function CheckShowError(obj) {
    if ($.trim(obj.val()) == "") {
        obj.next(".failInfo").show();
        return false;
    } else {
        obj.next(".failInfo").hide();
        return true;
    }
}

function CheckEmail(obj) {
    if ($.trim(obj.val()) == "") {
        obj.next("div[class='failInfo']").show();
        return false;
    } else {
        if (!checkemail($.trim(obj.val()))) {
            obj.next("div[class='failInfo']").html("请输入正确的电子邮箱！");
            obj.next("div[class='failInfo']").show();
            obj.focus();
        } else {
            obj.next("div[class='failInfo']").html("电子邮箱不能为空！");
            obj.next("div[class='failInfo']").hide();
        }
    }

}

function MathRand(n) {
    var Num = "";
    for (var i = 0; i < n; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

//验证必填项
function checkrequire() {
    var result = 0;
    $(document).find("input").each(function () {
        if ($(this).attr("isrequired") != null && $(this).attr("isrequired") != undefined && $(this).attr("isrequired") != "") {
            var tv = $.trim($(this).val());
            var ctype = $(this).attr("ctype");
            if (tv == "") {
                if (ctype == "Email") {
                    $(this).next().html("邮箱不能为空！");
                }
                else if (ctype == "Mobile") {
                    $(this).next().html("手机号不能为空！");
                }
                else if (ctype == "loginpwd") {
                    $(this).next().html("登录密码不能为空！");
                }
                else if (ctype == "surepwd") {
                    $(this).next().html("确认密码不能为空！");
                }
                else if (ctype == "Phone") {
                    var dess = "联系电话不能为空！";
                    if ($(this).attr("nulltip") != null && $(this).attr("nulltip") != undefined && $(this).attr("nulltip") != "") {
                        dess = $(this).attr("nulltip");
                    }
                    $(this).next().html(dess);
                }
                $(this).next().show();
                result++;
            }
        }
        //验证邮箱
        if ($(this).attr("ctype") != null && $(this).attr("ctype") != undefined && $(this).attr("ctype") != "") {
            var ctype = $(this).attr("ctype");
            var tv = $.trim($(this).val());
            if (tv != "") {
                if (ctype == "Email") {
                    if (!checkemail(tv)) {
                        $(this).next().html("邮箱格式不正确！");
                        $(this).next().show();
                        $(this).focus();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
                else if (ctype == "Mobile") {
                    if (!checkphone(tv)) {
                        $(this).next().html("手机号格式不正确！");
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
                else if (ctype == "Phone") {
                    if (!checkWorkPhone(tv)) {
                        var des = "电话号码格式不正确！";
                        if ($(this).attr("des") != null && $(this).attr("des") != undefined && $(this).attr("des") != "") {
                            des = $(this).attr("des");
                        }
                        $(this).next().html(des);
                        $(this).next().show();
                        $(this).focus();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
                else if (ctype == "loginpwd") {
                    var rv = CheckPwd(tv);
                    if (rv!="") {
                        $(this).next().html(rv);
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                } else if (ctype == "surepwd") {
                    var pwd = $.trim($(".Password").val());
                    if (tv != pwd) {
                        $(this).next().html("登录密码与确认密码不一致！");
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
            }

        }
    });
    $(document).find("textarea").each(function () {
        if ($(this).attr("isrequired") != null && $(this).attr("isrequired") != undefined && $(this).attr("isrequired") != "") {
            var tv = $.trim($(this).val());
            if (tv == "") {
                $(this).next().show();
                result++;
            }
        }
    });
    if (result > 0) {
        return false;
    }
    return true;
}

//验证区域必填项
function checkarearequire(obj) {
    var result = 0;
    $("."+obj).find("input").each(function () {
        if ($(this).attr("isrequired") != null && $(this).attr("isrequired") != undefined && $(this).attr("isrequired") != "") {
            var tv = $.trim($(this).val());
            var ctype = $(this).attr("ctype");
            if (tv == "") {
                if (ctype == "Email") {
                    $(this).next().html("邮箱不能为空！");
                }
                else if (ctype == "Mobile") {
                    $(this).next().html("手机号不能为空！");
                }
                else if (ctype == "loginpwd") {
                    $(this).next().html("登录密码不能为空！");
                }
                else if (ctype == "surepwd") {
                    $(this).next().html("确认密码不能为空！");
                }
                $(this).next().show();
                result++;
            }
        }
        //验证邮箱
        if ($(this).attr("ctype") != null && $(this).attr("ctype") != undefined && $(this).attr("ctype") != "") {
            var ctype = $(this).attr("ctype");
            var tv = $.trim($(this).val());
            if (tv != "") {
                if (ctype == "Email") {
                    if (!checkemail(tv)) {
                        $(this).next().html("邮箱格式不正确！");
                        $(this).next().show();
                        $(this).focus();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
                else if (ctype == "Mobile") {
                    if (!checkphone(tv)) {
                        $(this).next().html("手机号格式不正确！");
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
                else if (ctype == "Phone") {
                    if (!checkWorkPhone(tv)) {
                        var des = "联系电话不正确！";
                        if ($(this).attr("des") != null && $(this).attr("des") != undefined && $(this).attr("des") != "") {
                            des = $(this).attr("des");
                        }
                        $(this).next().html(des);
                        $(this).next().show();
                        $(this).focus();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
                else if (ctype == "loginpwd") {
                    var rv = CheckPwd(tv);
                    if (rv != "") {
                        $(this).next().html(rv);
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                } else if (ctype == "surepwd") {
                    var pwd = $.trim($("#txtRetPassword").val());
                    if (tv != pwd) {
                        $(this).next().html("登录密码与确认密码不一致！");
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                } else if (ctype == "surepwdreg") {
                    var pwd = $.trim($(".Password").val());
                    if (tv != pwd) {
                        $(this).next().html("登录密码与确认密码不一致！");
                        $(this).next().show();
                        result++;
                    } else {
                        $(this).next().hide();
                    }
                }
            }

        }
    });
    $("." + obj).find("textarea").each(function () {
        if ($(this).attr("isrequired") != null && $(this).attr("isrequired") != undefined && $(this).attr("isrequired") != "") {
            var tv = $.trim($(this).val());
            if (tv == "") {
                $(this).next().show();
                result++;
            }
        }
    });
    if (result > 0) {
        return false;
    }
    return true;
}

//显示加载中
function ShowLoading() {
    $(this).loadingshow();
}
//隐藏
function HideLoading() {
    $(this).loadinghide();
}

//返回
function prepage() {
    history.go(-2);
}

//我的申请
function gotomyapply() {
   window.location.href = "myapply.html";
}

//跳转到发布说明
function gotosuccesspage() {
    $(this).alert("提交成功！");
    setTimeout(function () {window.location.href = "http://" +window.location.host + "/success.html"; }, 2000);
    
}

function CheckUserLogin() {
    var userStatus = false;
    ShowLoading();
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",
        async: false,
        success: function (result) {
            if (result == null) {
                $(this).loginconfirmPC();
            }
            else{
                userStatus = true;
            }
            HideLoading();
        }
    });
    return userStatus;
}

//清空密码和自动登陆
function ClearInitLogin() {
    $.cookie("rmbUser", '', { path: "/", expires: -1 });
    $.cookie("passWord", '', { path: "/", expires: -1 });
    $.cookie("rmbUserAuto", '', { path: "/", expires: -1 });
}

//调用微信拍照接口,限上传一张照片,上传公司logo调用
function GetPic() {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            $("#imglogo").attr("src", localIds);
            $("#imglogo").show();
            $(".hidlocalid").val(localIds);
            $(".comlogo").hide();
            wx.uploadImage({
                localId: '' + localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    $(".hidmedid").val(serverId);
                }
            });
        }
    });
}

function GetImagePics() {
    wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            syncUpload(localIds);
        }
    });
}

$('#filePicker').on('click', function () {
    wx.chooseImage({
        success: function (res) {
            var localIds = res.localIds;
            syncUpload(localIds);
        }
    });
});
var syncUpload = function (localIds) {
    var localId = localIds.pop();
    wx.uploadImage({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            var html = "";
            html += "<li>\
                        <div class='incubatorPic'>\
                        <img src=" + localId + ">\
                        <a class='removeBtn' onclick='removeImg(this)'></a>\
                        <input type='hidden' class='hidlocalid' value=" + localId + " />\
                        <input type='hidden' class='hidmedid' value=" + serverId + " />\
                        </div>\
                    </li>";
            $(".addIncubatorBtn").parent().before(html);
            //其他对serverId做处理的代码
            if (localIds.length > 0) {
                syncUpload(localIds);
            }
        }
    });
};
function removeImg(obj) {
    $(obj).parent().parent().remove();
    $("#delImgs").val($("#delImgs").val() + $(obj).attr("src") + ",");
}

function UpLoadImg(id, medid, filename) {
    var savepath = "ActivityFolder";
    var weixin = {
        SavePath: savepath,
        MediaID: medid,
        FileName: filename
    };
    var activityimages = {
        activityID: id,
        fileName: filename
    };
    var formObj = {
        "activityImages": activityimages,
        "WeiXinRequest": weixin,
        "DelImgs": $("#delImgs").val()
};
    var parameter = {
        requestUri: "/api/activityimages",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function() {
            gotosuccesspage();
        },
        error: function(result) {
            ErrorResponse(result);
        }
    });
}

Date.prototype.FormatDate = function (fmt) { //author: meizz   
    var month = this.getMonth();
    if (month < 10) {
        month = "0" + month;
    }
    var o = {
        "M+": month,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (o[k]));
        }
    return fmt;
}
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth(),                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (o[k]));
    return fmt;
    return fmt;
}
Date.prototype.FormatCurrentMonth = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth()+1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (o[k]));
    return fmt;
}

//格式化日期包含0
Date.prototype.FormatIncludeZero = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
        }
    }
    return format;
};

function searchLayout() {
    $(".incubatorSearchIpt").val("");
    $(".incubatorSearchIpt").focus(function () {
        $(this).prop("placeholder", "搜索");
        $(this).prev(".incubatorSearchIptBg").addClass("txtLeft").find("span").hide();
        $(this).parent(".searchBox").animate({ marginRight: "50px" }, function () { $(".searchBtn").animate({ opacity: "1" }); });
    });
    $(".incubatorSearchIpt").blur(function () {                       //mobile搜索框失去焦点动作
        if ($(this).val() == "") {
            $(this).prop("placeholder", "");
            $(this).prev(".incubatorSearchIptBg").removeClass("txtLeft").find("span").show();
            $(this).parent(".searchBox").stop(true).animate({ marginRight: "0px" });
            $(".searchBtn").stop(true).animate({ opacity: "0" }, 0);
        };
    });
};

function CheckDateTime() {
    var startTime = $("#hiddenStartTime").val();
    var endTime = $("#hiddenEndTime").val();
    var date = new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 7);
    if (startTime < date.FormatDate("yyyy-MM-dd")) {
        $("#startTime").next().html("开始日期必须晚于当前时间一周！");
        $("#startTime").next().show();
        return false;
    }
    if (endTime < date.FormatDate("yyyy-MM-dd")) {
        $("#endTime").next().html("结束日期必须晚于当前时间一周！");
        $("#endTime").next().show();
        return false;
    }
    if (startTime > endTime) {
        $("#endTime").next().html("开始日期不能大于结束日期！");
        $("#endTime").next().show();
        return false;
    }
    return true;
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


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

//替换换行
function ProcessWrap(value) {
    var reg = new RegExp("\r", "g");
    value = value.replace(reg, "<br>");
    reg = new RegExp("\n", "g");
    value = value.replace(reg, "<br>");
    reg = new RegExp("\r\n", "g");
    value = value.replace(reg, "<br>");
    return value;
}

Array.prototype.delRepeat7 = function () {
    var temp = {}, len = this.length;
    for (var i = 0; i < len; i++) {
        var tmp = this[i];
        if (!temp.hasOwnProperty(tmp)) {//hasOwnProperty用来判断一个对象是否有你给出名称的属性或对象
            temp[this[i]] = "yes";
        }
    }
    len = 0;
    var tempArr = [];
    for (var i in temp) {
        tempArr[len++] = i;
    }
    return tempArr;
}
var GetLength = function (str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4  
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (str_length < len) {
        return str;
    }
}
//点击同意协议
function ClickAgree(obj) {
    if (obj.checked) {
        $("#aSubmit").removeClass("grayBtn");
        $("#aSubmit").attr("onclick", "SubmitForm();");
        $("#aSubmit").css("cursor", "");
    } else {
        $("#aSubmit").addClass("grayBtn");
        $("#aSubmit").css("cursor", "default");
        $("#aSubmit").removeAttr("onclick");
    }
}


//点击广告更新点击数
function ShowInfo(url, id) {
    var parameter = {
        requestUri: "/api/advertisement/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get/anonymous",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
    window.open(url);
}