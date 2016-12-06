//显示上传
function showuploadcomlogo() {
    $(".comlogodiv").show();
}
//隐藏上传
function hideuploadcomlogo() {
    $(".comlogodiv").hide();
    $("#hidimgname").val("");
    $(".jcrop-active").hide();
    }
//上传公司logo
function UploadComLogo() {
    if ($("#filecomlogo").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }
    var parameter = {
        "requestUri": "/api/user/file",
        "requestParameters": {
            "LogoUrl": $("#filecomlogo").val()
        }
    };

    var parameterJson = JSON.stringify(parameter);

    $.ajaxFileUpload
    (
        {
            url: '/api/proxy/user/ufile', //用于文件上传的服务器端请求地址
            contentType: "application/json; charset=utf-8",
            secureuri: false, //一般设置为false
            fileElementId: 'filecomlogo', //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            type: 'post',
            data: { SavePath: 'InvestorFolder', FileExtension: 'FileExtension', LogoSize: 'UserLogoSize', LogoRadio: 'InvestorRadio' },
            success: function (data, status) //服务器成功响应处理函数
            {
                if (data != null && data != undefined) {
                    if (data.headImgUrl == "error") {
                        $(this).alert("图片格式错误！");
                    } else {
                        $(".logotip").hide();//隐藏
                        var iname = data.headImgUrl.substr(data.headImgUrl.lastIndexOf('/'));
                        $("#hidimgname").val(iname);
                        var imglabel = "<img id='imgCropcomlogo' src='" + data.sImgUrl + data.headImgUrl + "' alt='' style='width:300px;height:300px;'/> ";
                        $(".imgcomlogoreview").html(imglabel);
                        var initsize = 200;
                        if (data.xy != null && data.xy != undefined && data.xy != "") {
                            initsize = parseInt(data.xy);
                        }
                        $("#hidxy").val(initsize);
                        $("#hidradio").val(data.radio);
                        initcomlogojcrop();
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
function cropcomlogofile() {
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
            "SavePath": "InvestorFolder"
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
            hideuploadcomlogo();
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
function PostPublish() {
    if (!checkarearequire("investortable")) {
        return false;
    }
    var logourl = $.trim($("#hidlogourl").val());
    if (logourl == "") {
        $(".logotip").show();
        return false;
    } else {
        $(".logotip").hide();
    }
    ShowLoading();
    var savepath = "InvestorFolder";
    var fname = guid();
    var companyName = $.trim($("#CompanyName").val());
    //var companyLogo = savepath + "\\" + fname;
    var fundScale = $.trim($("#FundScale").val());
    var investmentField = $.trim($("#InvestmentField").val());
    var investorName = $.trim($("#InvestorName").val());
    var email = $.trim($("#Email").val());
    var investmentStage = $.trim($("#selectBtn").val());
    var address = $.trim($("#Address").val());
    var investmentCase = $.trim($("#InvestmentCase").val());


    var frPublish = {
        UserID: "",
        CompanyName: companyName,
        CompanyLogo: logourl,
        FundScale: fundScale,
        InvestmentField: investmentField,
        InvestorName: investorName,
        Email: email,
        InvestmentStage: investmentStage,
        Address: address,
        InvestmentCase: investmentCase
    };
    var formObj = {
        "InvestorInformation": frPublish
    };
    var parameter = {
        requestUri: "/api/investorinformation",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            $(this).alert("提交成功！");
            setTimeout(function () { window.location.href = "investormanagement.html"; }, 2000);
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });

}
//取消
function CancelAuthInvestor() {
    window.location.href = "investormanagement.html";
}

function storeCoordscomlogo(c) {
    jQuery('#X').val(Math.round(c.x));
    jQuery('#Y').val(Math.round(c.y));
    jQuery('#W').val(Math.round(c.w));
    jQuery('#H').val(Math.round(c.h));
};
function initcomlogojcrop() {
    var initsize = $("#hidxy").val();
    var initradio = $("#hidradio").val();
    jQuery('#imgCropcomlogo').Jcrop({
        onSelect: storeCoordscomlogo,
        bgFade: true,
        bgOpacity: .2,
        setSelect: [0, 0, initsize, initsize],
        boxWidth: 450,
        boxHeight: 450,
        aspectRatio: initradio
    });
}

//获取投资阶段信息
function GetInvestmentStage() {
    var formObj = {
        "Key": "InvestmentStage"
    };
    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);

    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (data) {
            var results = data.results;
            if (results != null && results != undefined && results.length > 0) {
                var htmlItem = "";
                for (var i = 0; i < results.length; i++) {
                    if (i == 0) {
                        htmlItem += "<option value=\"" + results[i].id + "\" selected>" + results[i].value + "</option>";
                    } else {
                        htmlItem += "<option value=\"" + results[i].id + "\">" + results[i].value + "</option>";
                    }
                }
                $("#selectBtn").html(htmlItem);
                $(".selectIpt").select2({
                    minimumResultsForSearch: Infinity
                });
            }
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
$(function () {
    GetInvestmentStage();
    
});