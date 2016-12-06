//页面加载
$(function () {
    //初始化数据
    InitUserData();
});

function InitUserData() {
    ShowLoading();
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",
        //data: parameterJson,
        success: function (result) {
            if (result == null) {
                $(this).loginconfirmPC();
                HideLoading();
            } else {
                $("#individualName").html(result.userName);
                $("#userType").html("身份：" + result.userType);
                $("#mobile").html("联系电话：" + result.mobile);
                $("#email").html("Email： "+result.email);
                $("#address").html("地址：" + result.address);
                var imglabel = "<img id='imgCrop' src='" + result.avatar + "' alt=''/> ";
                $(".cropuserlogo").html(imglabel);
                $("#userId").val(result.userID);
                $("#hidMobile").val(result.mobile);
               
                HideLoading();
            }
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
            
        }
    });
}
function edituserinfo() {
    window.location.href = "improveuserinfo.html?mobile="+$("#hidMobile").val();
}

//保存成功后刷新当前用户信息
function RefreshUser() {
    $.ajax({
        type: "PUT",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/user/refresh",
        success: function (result) {
           // $(this).alert("保存成功！");
            //setTimeout(function () { window.location.href = "myprofile.html"; }, 2000);
            InitUserData_Home();//更新图标
        },
        error: function (result) {
            //$(this).alert("保存成功！");
            //setTimeout(function () { window.location.href = "myprofile.html"; }, 2000);
            ErrorResponse(result);
        }
    });
}
//上传后保存logo到数据库
function savelogo() {
    var iname = $("#hidlogourl").val();
    var parameter = {
        "requestUri": "/api/user/logo",
        "requestParameters": {
            "LogoUrl": iname,
            "User": {
                "UserID":$("#userId").val()
            }
        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/put",
        data: parameterJson,
        success: function (result) {
            RefreshUser();
            
        },
        error: function (result) {
            ErrorResponse(result);
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
    $(".jcrop-active").hide();
    $("#hidimgname").val("");
}
//上传公司logo
function UploadownLogo() {
    if ($("#fileownlogo").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }
    var str = $("#fileownlogo").val();
    var fileexten = str.substring(str.lastIndexOf('.') + 1).toLowerCase();
    if (fileexten != "png" && fileexten != "jpg" && fileexten != "bmp" && fileexten != "gif") {
        $(this).alert("只能上传图片格式文件！");
        $("#fileownlogo").val("");
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
            var imglabel = "<img id='imglogocrop' src='" + result.sImgUrl + result.headImgUrl + "' alt=''/> ";
            $(".croplogo").html(imglabel);
            $("#hidlogourl").val(result.headImgUrl);
            $(".jcrop-active").hide();
            savelogo();
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