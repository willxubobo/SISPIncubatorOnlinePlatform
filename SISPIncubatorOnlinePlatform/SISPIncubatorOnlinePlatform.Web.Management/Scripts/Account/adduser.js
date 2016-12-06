
$(function () {
    GetRoles();
    Registration();
    var userid = getUrlParam("userid");
    if (userid != null && userid != undefined && userid != "") {
        ShowLoading();
        GetUserInfo(userid);
        $(".lastmenu").html("修改用户信息");
    }
});
function Registration() {
    $(document).on("click", ".registerRadio", function () {
        $(this).addClass("on").siblings(".registerRadio").removeClass("on");
    });
};
function checkcomname() {
    var comname = $.trim($(".CompanyName").val());
    if (comname == "") {
        $(".CompanyNameTip").show();
    } else {
        $(".CompanyNameTip").hide();
    }
}
function ChangeFile(obj) {
    var str = $(obj).val();
    $(obj).next().html(str.substring(str.lastIndexOf('\\') + 1));
    $(obj).next().next().hide();
}
//根据编号获取用户信息
function GetUserInfo(userid) {
    var parameter = {
        "requestUri": "/api/user/pending/" + userid,
        "requestParameters": {
            "userid": userid
        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get",
        data: parameterJson,
        success: function (result) {
            if (result == null) {
                $(this).alert("用户未登录！");
            } else {
                if (result.user_status == "False") {
                    $(".IsUse").prop("checked", true);
                }
                $(".modifyshow").show();//显示是否禁用　
                var imglabel = "<img id='imglogocrop' src='" + result.user_avatar + "' alt='' class='uploadimgshowsize'/> ";
                $(".croplogo").html(imglabel);
                $("#hidlogourl").val(result.user_avatar);
                $(".UserName").val(result.user_name);
                $(".hiduserid").val(result.user_id);
                //$(".Mobile").val(result.results[0].mobile);
                $(".Mobile").val(result.user_mobile);
                $(".hidphone").val(result.user_mobile);
                $(".Email").val(result.user_email);
                var utype = result.user_type;
                if (utype == "个人") {
                    $(".bussiness").removeClass("on");
                    $(".person").addClass("on");
                    $(".hidutype").val("个人");
                } else {
                    $(".bussiness").addClass("on");
                    $(".person").removeClass("on");
                    $(".hidutype").val("企业");
                    $(".CompanyName").val(result.user_comname);
                    $(".Description").val(result.user_desc);
                    $(".companyuser").show();
                }
                $(".Address").val(result.user_address);
                $(document).find("input[type='checkbox']").each(function () {
                    if (result.user_roles.indexOf($(this).val()) != -1) {
                        $(this).prop("checked", "checked");
                    }
                });
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//提交修改
function saveform() {
    var cansubmit = false;
    var logourl = $.trim($("#hidlogourl").val());
    //if (logourl == "") {
    //    $(".logotip").show();
    //    return false;
    //} else {
    //    $(".logotip").hide();
    //}
    if (!checkrequire()) {
        cansubmit = true;
    }
    var isadd = false;
    var rmobile = getUrlParam("userid");
    var submiturl = "/api/proxy/put";
    if (rmobile == null || rmobile == undefined || rmobile == "") {
        submiturl = "/api/proxy/post";
        isadd = true;
    }
    var comname = $.trim($(".CompanyName").val());
    var filelinense = $.trim($("#filelinense").val());
    var filecard = $.trim($("#filecard").val());
    var UserType = $('.hidutype').val();
    if (UserType == "企业") {
        if (isadd) {
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
    }
    if (cansubmit) {
        return false;
    }
    ShowLoading();
    var UserName = $.trim($(".UserName").val());
    var mobile = $.trim($(".Mobile").val());
    var fname = guid();
    var email = $.trim($(".Email").val());
    var UserID = $(".hiduserid").val();
    var Address = $.trim($('.Address').val());
    var fids = "";
    $("#rolelist").find("input[type='checkbox']").each(function () {
        if ($(this).prop("checked") == true) {
            fids += $(this).val() + ",";
        }
    });
    var isuse = 1;
    if ($(".IsUse").is(":checked")) {
        isuse = 0;
    }
    var frPublish = {
        UserName: UserName,
        Mobile: mobile,
        Email: email,
        UserType: UserType,
        Address: Address,
        UserID: UserID,
        Status:isuse
    };
    var formObj = {
        "RegSource":"mobile",
        "Code": "",
        "AddType":"manager",
        "User": frPublish,
        "RoleID": fids,
        LogoUrl: $("#hidlogourl").val(),
        "WeChat": {
            Nickname: UserName,
            Headimgurl: logourl
        }
    };
    var parameter = {
        requestUri: "/api/user",
        requestParameters: formObj
    }

    var parameterJson = JSON.stringify(parameter);
    
    $.ajax({
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function (result) {
            if (UserType == "企业") {
                var cuid = $(".hiduserid").val();
                if (cuid == "") {
                    cuid = result;
                }
                UploadComInfo(cuid);
            } else {
                $(this).alert("提交成功！");
                setTimeout(function() {
                    if (typeof (window.opener.InitGetuserData) == "function") {
                        window.opener.InitGetuserData();
                    }
                    window.close();
                }, 2000);
            }
        },
        error: function (result) {
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
        data: { UserID: userid, ComName: comname, ComDesc: descript,IsAdminAddCom:"true" },
        success: function (data, status) //服务器成功响应处理函数
        {
            $(this).alert("提交成功！");
            setTimeout(function () {
                if (typeof(window.opener.InitGetuserData) == "function") {
                    window.opener.InitGetuserData();
                }
                window.close();
            }, 2000);

        },
        error: function (data, status, e) //服务器响应失败处理函数
        {
            $(this).alert(e);
        }
    });
}
//显示上传
function showuploadownlogo() {
    $(".ownlogodiv").show();
}
//隐藏上传
function hideuploadownlogo() {
    $(".ownlogodiv").hide();
    $("#hidimgname").val("");
    $(".jcrop-active").hide();
}
//上传公司logo
function UploadownLogo() {
    if ($("#fileownlogo").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }
    var parameter = {
        "requestUri": "/api/user/file",
        "requestParameters": {
            "LogoUrl": $("#fileownlogo").val()
        }
    };

    var parameterJson = JSON.stringify(parameter);

    $.ajaxFileUpload
    (
        {
            url: '/api/proxy/user/ufile', //用于文件上传的服务器端请求地址
            contentType: "application/json; charset=utf-8",
            secureuri: false, //一般设置为false
            fileElementId: 'fileownlogo', //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            type: 'post',
            data: { SavePath: 'PersonLogoFolder', FileExtension: 'FileExtension', LogoSize: 'UserLogoSize' },
            success: function (data, status) //服务器成功响应处理函数
            {
                if (data != null && data != undefined) {
                    if (data.headImgUrl == "error") {
                        $(this).alert("图片格式错误！");
                    } else {
                        //$(".logotip").hide();//隐藏
                        var iname = data.headImgUrl.substr(data.headImgUrl.lastIndexOf('/'));
                        $("#hidimgname").val(iname);
                        var imglabel = "<img id='imgCropownlogo' src='" + data.sImgUrl + data.headImgUrl + "' alt=''/> ";
                        $(".imgownlogoreview").html(imglabel);
                        var initsize = 200;
                        if (data.xy != null && data.xy != undefined && data.xy != "") {
                            initsize = parseInt(data.xy);
                        }
                        $("#hidxy").val(initsize);
                        initownlogojcrop();
                        jQuery('#X').val(initsize);
                        jQuery('#Y').val(initsize);
                        jQuery('#W').val(initsize);
                        jQuery('#H').val(initsize);
                        //if (typeof (data.error) != 'undefined') {
                        //    if (data.error != '') {
                        //        $(this).alert(data.error);
                        //    } else {
                        //        $(this).alert(data.msg);
                        //    }
                        //}
                    }
                }
            },
            error: function (data, status, e) //服务器响应失败处理函数
            {
                // $(this).alert(e);
            }
        }
    );
    return false;
}
//截取上传图片
function cropownlogofile() {
    var iname = $.trim($("#hidimgname").val());
    if (iname == "") {
        $(this).alert("请选择图片！");
        return;
    }
    var xy = Math.round($("#W").val()) + "," + Math.round($("#H").val()) + "," + Math.round($("#X").val()) + "," + Math.round($("#Y").val());
    var parameter = {
        "requestUri": "/api/user/cropfile",
        "requestParameters": {
            "ImgName": iname,
            "Xy": xy,
            "SavePath": "PersonLogoFolder"
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
            hideuploadownlogo();
            var imglabel = "<img id='imglogocrop' src='" + result.sImgUrl + result.headImgUrl + "' alt='' class='uploadimgshowsize'/> ";
            $(".croplogo").html(imglabel);
            $("#hidlogourl").val(result.headImgUrl);
            $(".jcrop-active").hide();
            $(".logotip").hide();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function storeCoordsownlogo(c) {
    jQuery('#X').val(Math.round(c.x));
    jQuery('#Y').val(Math.round(c.y));
    jQuery('#W').val(Math.round(c.w));
    jQuery('#H').val(Math.round(c.h));
};
function initownlogojcrop() {
    var initsize = $("#hidxy").val();
    jQuery('#imgCropownlogo').Jcrop({
        onSelect: storeCoordsownlogo,
        bgFade: true,
        bgOpacity: .2,
        setSelect: [0, 0, initsize, initsize],
        boxWidth: 450,
        boxHeight: 450,
        aspectRatio: 1
    });
}

//获取所有角色
function GetRoles() {
    var parameter = {
        "requestUri": "/api/roles/all",
        "requestParameters": {

        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        async: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result != null && result != undefined && result.results.length > 0) {
                var content = "<table>";
                for (var i = 0; i < result.results.length; i++) {
                    var item = result.results[i];
                    if (i % 6 == 0) {
                        content += "<tr>";
                    }
                    content += "<td><input class=\"check-ipt\" type=\"checkbox\" value=\"" + item.roleID + "\">" + item.roleName + "</td>";
                    if (i % 6 == 0&&i!=0) {
                        content += "</tr>";
                    }
                }
                if (result.results.length < 6) {
                    content += "</tr>";
                } else {
                    if (result.results.length % 6 != 0) {
                        for (var j = 0; j < 6 - (result.results.length % 6); j++) {
                            content += "<td>&nbsp;</td>";
                        }
                        content += "</tr>";
                    }
                }
                content += "</table>";
                $("#rolelist").html(content);
                //initMenu();
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
