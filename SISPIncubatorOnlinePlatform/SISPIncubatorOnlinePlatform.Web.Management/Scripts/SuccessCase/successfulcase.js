$(function () {
    ue = UE.getEditor('container');
    InitSelectOption();
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
    var caseId = getUrlParam("id");
    ue.ready(function () {
        if (caseId != null && caseId != "") {
            $(".checkDiv").show();
            GetInfo(caseId);
        }
    });
    
});
var ue = "";

function InitSelectOption() {
    var dictionary = {
        Key: "SCCategory"
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
        async:false,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                var data = result.results;
                var caseId = getUrlParam("id");
                var html = "";
                if (caseId != null && caseId != "") {
                    for (var i = 0; i < data.length; i++) {
                            html += "<option id=" + data[i].id + ">" + data[i].value + "</option>";

                    }
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        if (i == 0) {
                            html += "<option selected='selected' id=" + data[i].id + ">" + data[i].value + "</option>";
                        } else {
                            html += "<option id=" + data[i].id + ">" + data[i].value + "</option>";
                        }

                    }
                }
                $("#statusSelectIpt").append(html);
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function GetInfo(caseId) {
    ShowLoading();
    var parameter = {
        "requestUri": "/api/successfulcase/" + caseId
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get",
        data: parameterJson,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                $("#title").val(result.results[0].title);
                $("#statusSelectIpt").find("option").each(function () {
                    if ($(this).text() == result.results[0].category) {
                        $(this).attr("selected", "selected");
                        $(".selectIpt").select2();
                    }
                });
               
                ue.setContent(result.results[0].content, true);
                var html = "<img id='imgpgcrop' src='" + result.results[0].picture + "' class='uploadimgshowsize'>";
                $(".croplogo").append(html)
                if (result.results[0].status) {
                    $("#isShow").prop("checked", true);
                }
                else {
                    $("#isShow").prop("checked", false);
                }

            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
//显示上传
function showUploadPropg() {
    $(".prologodiv").show();
}
//隐藏上传
function hideuploadpropg() {
    $(".prologodiv").hide();
}
function UploadPropg() {
    if ($("#fileprologo").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }

    $.ajaxFileUpload
    (
        {
            url: '/api/proxy/user/ufile', //用于文件上传的服务器端请求地址
            contentType: "application/json; charset=utf-8",
            secureuri: false, //一般设置为false
            fileElementId: 'fileprologo', //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            type: 'post',
            data: { SavePath: 'CaseFolder', FileExtension: 'FileExtension', LogoSize: 'caseLogoSize', LogoRadio: 'caseLogoRadio' },
            success: function (data, status) //服务器成功响应处理函数
            {
                if (data != null && data != undefined) {
                    if (data.headImgUrl == "error") {
                        $(this).alert("图片格式错误！");
                    } else {
                        $(".logotip").hide();//隐藏
                        var iname = data.headImgUrl.substr(data.headImgUrl.lastIndexOf('/'));
                        $("#hidimgname").val(iname);
                        var imglabel = "<img id='imgCroppropgdd' src='" + data.sImgUrl + data.headImgUrl + "' alt='' style='width:300px;height:300px;'/> ";
                        $(".imgprologoreviewdd").html(imglabel);
                        var initsize = 800;
                        if (data.xy != null && data.xy != undefined && data.xy != "") {
                            initsize = parseInt(data.xy);
                        }
                        $("#hidxy").val(initsize);
                        $("#hidradio").val(data.radio);
                        initcasejcrop();
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

function cropprologofile() {
    var iname = $("#hidimgname").val();
    var xy = Math.round($("#W").val()) + "," + Math.round($("#H").val()) + "," + Math.round($("#X").val()) + "," + Math.round($("#Y").val());
    var parameter = {
        "requestUri": "/api/user/cropfile",
        "requestParameters": {
            "ImgName": iname,
            "Xy": xy,
            "SavePath": "CaseFolder"
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
            hideuploadpropg();
            var imglabel = "<img id='imgpgcrop' src='" + result.sImgUrl + result.headImgUrl + "' alt='' class='uploadimgshowsize'/> ";
            $(".croplogo").html(imglabel);
            $("#hidlogourl").val(result.headImgUrl);
            $(".jcrop-active").hide();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function storeCoordspropg(c) {
    jQuery('#X').val(Math.round(c.x));
    jQuery('#Y').val(Math.round(c.y));
    jQuery('#W').val(Math.round(c.w));
    jQuery('#H').val(Math.round(c.h));
};
function initcasejcrop() {
    var initsize = $("#hidxy").val();
    var initradio = $("#hidradio").val();
    jQuery('#imgCroppropgdd').Jcrop({
        onSelect: storeCoordspropg,
        bgFade: true,
        bgOpacity: .2,
        setSelect: [initsize, initsize, initsize, initsize],
        boxWidth: 450,
        boxHeight: 450,
        aspectRatio: initradio
    });
}

function PostSuccessFulCase() {
    var title = $.trim($("#title").val());
    var category = $.trim($("#statusSelectIpt").find("option:selected").prop("id"));
    var picture = $("#imgpgcrop").prop("src");
    var content = ue.getPlainTxt();
    if (!checkcasequire(title, picture)) {
        return false;
    }
    var caseId = getUrlParam("id");
    var submiturl = "/api/proxy/put";
    var status = $("#isShow").prop("checked");
    if (caseId == null || caseId == "") {
        submiturl = "/api/proxy/post";
        status = true;
    }
    ShowLoading();
    var successfulcase = {
        CaseID:caseId,
        Title : title,
        Content : content,
        Picture : picture,
        Category: category,
        Status:status
    };
    var formObj = {
        "SuccessfulCase": successfulcase
    };
    var parameter = {
        requestUri: "/api/successfulcase",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
   
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function (result) {
            $(this).alert("提交成功！");
            setTimeout(function () {
                window.opener.IniCaseData();
                window.close();
                }, 2000);
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
function CaseCancel() {
    window.close();
}

function checkcasequire(title, picture) {
    if (title == "" || title == undefined) {
        $("#title").next().show();
        return false;
    }
    else if (picture == ""||picture == undefined) {
        $(".logotip").show();
        return false;
    }
    return true;
}