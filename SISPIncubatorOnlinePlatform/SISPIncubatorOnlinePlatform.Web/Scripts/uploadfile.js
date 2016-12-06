function showupload() {
    $(".registerdiv").hide();
    $(".userlogodiv").show();
}
//截取上传图片
function cropfile() {
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
            $(".registerdiv").show(); 
            $(".userlogodiv").hide();
            var imglabel = "<img id='imglogocrop' src='" + result.sImgUrl + result.headImgUrl + "' alt=''/> ";
            $(".croplogo").html(imglabel);
            $("#hidlogourl").val(result.headImgUrl);
            $(".jcrop-active").hide();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//截取上传图片并刷新当前登录用户
function croplogo() {
    var iname = $("#hidimgname").val();
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
            $(".userlogodiv").hide();
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
//取消上传头像
function cancelupload() {
    $(".registerdiv").show();
    $(".userlogodiv").hide();
    $("#hidimgname").val("");
    $(".jcrop-active").hide();
}
//隐藏上传头像
function hidelogodiv() {
    $(".userlogodiv").hide();
    
}
function ajaxFileUpload() {
    if ($("#file1").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }
    var str = $("#file1").val();
    var fileexten = str.substring(str.lastIndexOf('.') + 1).toLowerCase();
    if (fileexten != "png" && fileexten != "jpg" && fileexten != "bmp" && fileexten != "gif") {
        $(this).alert("只能上传图片格式文件！");
        $("#file1").val("");
        return false;
    }
    var parameter = {
        "requestUri": "/api/user/file",
        "requestParameters": {
            "LogoUrl": $("#file1").val()
        }
    };
   
    var parameterJson = JSON.stringify(parameter);
    
    $.ajaxFileUpload
    (
        {
            url: '/api/proxy/user/ufile', //用于文件上传的服务器端请求地址
            contentType: "application/json; charset=utf-8",
            secureuri: false, //一般设置为false
            fileElementId: 'file1', //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            type: 'post',
            data: { SavePath: 'PersonLogoFolder', FileExtension: 'FileExtension', LogoSize: 'UserLogoSize' },
            success: function (data, status) //服务器成功响应处理函数
            {
                if (data != null && data != undefined) {
                    if (data.headImgUrl == "error") {
                        $(this).alert("图片格式错误！");
                    } else {
                        $(".logotip").hide();//隐藏
                        var iname = data.headImgUrl.substr(data.headImgUrl.lastIndexOf('/'));
                        $("#hidimgname").val(iname);
                        var imglabel = "<img id='imgCrop' src='" + data.sImgUrl + data.headImgUrl + "' alt='' style='width:500px;height:500px;'/> ";
                        $(".imgreview").html(imglabel);
                        var initsize = 200;
                        if (data.xy != null && data.xy != undefined && data.xy != "") {
                            initsize = parseInt(data.xy);
                        }
                        $("#hidxy").val(initsize);
                        initjcrop();
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
function storeCoords(c) {
    jQuery('#X').val(Math.round(c.x));
    jQuery('#Y').val(Math.round(c.y));
    jQuery('#W').val(Math.round(c.w));
    jQuery('#H').val(Math.round(c.h));
};
function initjcrop() {
    var initsize=$("#hidxy").val();
    jQuery('#imgCrop').Jcrop({
        onSelect: storeCoords,
        bgFade: true,
        bgOpacity: .2,
        setSelect: [0, 0, initsize, initsize],
        boxWidth: 450,
        boxHeight: 450,
        aspectRatio: 1
    });
}



