$(function () {
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
                        $(this).next().html(destip + "不能为空！");
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
                            var des = "联系电话格式不正确！";
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
                        var pwd = $.trim($(".Password").val());
                        if (tv != pwd) {
                            $(this).next().html("登录密码与确认密码不一致！");
                            $(this).next().show();
                        } else {
                            $(this).next().hide();
                        }
                    } else if (ctype == "RegisterMobile") {
                        if (!checkphone(tv)) {
                            $(this).next().html("手机号格式不正确！");
                            $(this).next().show();
                        } else if (!checkRegisterPhone(tv))
                        {
                            $(this).next().html("手机号已存在！");
                            $(this).next().show();
                            $("#hiddenSendCode").val("true");
                        }
                        else {
                            $(this).next().hide();
                            $("#hiddenSendCode").val("false");
                        }
                    }
                    else {
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
            $(this).loginconfirm();
        }
        else {
            if (errormes.message) {
                $(this).alert(errormes.message);
            }
            else {
                $(this).alert(errormes.Message);
            }
        }
    }
    else {
        if (errormes.message) {
            $(this).alert(errormes.message);
        }
        else {
            $(this).alert(errormes.Message);
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
                    var des = "联系电话不能为空！";
                    if ($(this).attr("nulltip") != null && $(this).attr("nulltip") != undefined && $(this).attr("nulltip") != "") {
                        des = $(this).attr("nulltip");
                    }
                    $(this).next().html(des);
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
                        var dess = "电话号码格式不正确！";
                        if ($(this).attr("des") != null && $(this).attr("des") != undefined && $(this).attr("des") != "") {
                            dess = $(this).attr("des");
                        }
                        $(this).next().html(dess);
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
    ShowLoading();
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",     
        success: function(result) {
            if (result == null) {
                $(this).loginconfirm();
            }
            else {
                HideLoading();
            }
        }
    });
}

//清空密码和自动登陆
function ClearInitLogin() {
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
            $("#comlogo").hide();
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

//调用微信拍照接口,限上传一张照片,上传企业营业执照调用
function GetLicensePic() {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            $("#imglogo").attr("src", localIds);
            $("#imglogo").show();
            $(".hidlocalid").val(localIds);
            $("#comlogo").hide();
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

//调用微信拍照接口,限上传一张照片,上传身份证调用
function GetCardPic() {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            $("#imgcardlogo").attr("src", localIds);
            $("#imgcardlogo").show();
            $(".hidcardlocalid").val(localIds);
            $("#comcardlogo").hide();
            wx.uploadImage({
                localId: '' + localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    $(".hidcardmedid").val(serverId);
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
            $("#imgfailInfo").hide();
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
        "h+": this.getHours(),
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
    if (startTime > endTime) {
        $("#endTime").next().html("开始日期不能大于结束日期！");
        $("#endTime").next().show();
        return false;
    }
    return true;
}

//生成几位随机数
function MathRand(h) {
    var Num = "";
    for (var i = 0; i < h; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
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

function checkImgs() {
    if ($(".incubatorList").find("li").length == 1) {
        $("#imgfailInfo").show();
        return false;
    }
    else {
        return true;
    }
}

function checkcomlogo() {
    if ($("#imglogo").prop("src") == "") {
        $("#comlogo").show();
        return false;
    } else {
        return true;
    }
}

function InitRemark() {
    ShowLoading();
    var dictionary = {
        Key: "ActivityRemark"
    }
    var parameter = {
        requestUri: "/api/informations",
        requestParameters: dictionary
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.results.length > 0) {
                var data = result.results;
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var sort = i + 1;
                    html += "<tr><td width='30px'>" + sort + ".</td><td>" + data[i].value + "</td></tr>";
                }
                $(".tipsTable").append(html);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}