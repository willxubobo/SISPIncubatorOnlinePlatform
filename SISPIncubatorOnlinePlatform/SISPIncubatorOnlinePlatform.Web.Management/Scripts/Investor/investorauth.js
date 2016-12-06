$(function () {
    GetInvestmentStage();
    var userid = getUrlParam("userid");
    if (userid != null && userid != undefined && userid != "") {
        $(".hiduserid").val(userid);
        GetInfo(userid);
        $(".lastmenu").html("修改投资机构");
    } else {
        $(".lastmenu").html("添加投资机构");
    }
});
//根据userid获取信息
function GetInfo(userid) {
    var parameter = {
        "requestUri": "/api/investorinformation/" + userid,
        "requestParameters": {

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
            if (result != null && result != undefined && result.results.length > 0) {
                $("#CompanyName").val(result.results[0].companyName);
                var imglabel = "<img id='imglogocrop' src='" + result.results[0].companyLogo + "' alt='' class='uploadimgshowsize'/> ";
                $(".croplogo").html(imglabel);
                $("#hidlogourl").val(result.results[0].companyLogo);
                $("#FundScale").val(result.results[0].fundScale);
                $("#InvestmentField").val(result.results[0].investmentField);
                $("#InvestorName").val(result.results[0].investorName);
                $("#Email").val(result.results[0].email);
                $("#selectBtn").val(result.results[0].investmentStage);
                $(".selectIpt").select2({
                    minimumResultsForSearch: Infinity
                });
                $("#Address").val(result.results[0].address);
                $("#InvestmentCase").val(result.results[0].investmentCase);
                if (result.results[0].isShow == true) {
                    $(".IsShowIndex").prop("checked", true);
                }
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
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
            var imglabel = "<img id='imglogocrop' src='" + result.sImgUrl + result.headImgUrl + "' alt='' class='uploadimgshowsize'/> ";
            $(".croplogo").html(imglabel);
            $("#hidlogourl").val(result.headImgUrl);
            $(".jcrop-active").hide();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function PostInvestorAuthPublish() {
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
    if ($(".hiduserid").val() == "") {
        $(".investorerrortip").show();
        return false;
    } else {
        $(".investorerrortip").hide();
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
    var userid = getUrlParam("userid");
    if (userid == null || userid == undefined || userid == "") {
        userid = "";
    }
    var IsShowIndex = 0;
    if ($(".IsShowIndex").is(":checked")) {
        IsShowIndex = 1;
    }
    var frPublish = {
        UserID: $(".hiduserid").val(),
        CompanyName: companyName,
        CompanyLogo: logourl,
        FundScale: fundScale,
        InvestmentField: investmentField,
        InvestorName: investorName,
        Email: email,
        InvestmentStage: investmentStage,
        Address: address,
        InvestmentCase: investmentCase,
        IsShow: IsShowIndex
    };
    var formObj = {
        "InvestorInformation": frPublish,
        "AddType":"admin"
    };
    var parameter = {
        requestUri: "/api/investorinformation",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    var submiturl = "/api/proxy/put";
    if (userid == null || userid == undefined || userid == "") {
        submiturl = "/api/proxy/post";
    }
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function (result) {
            $(this).alert("提交成功！");
            setTimeout(function () {
                window.opener.InitGetinvestorData();
                window.close();
            }, 2000);
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

//选择投资人
function SelectInvestorUser() {
    window.open("SelectUser.html");
}

//选择用户后得到userid
function SetUserIDBySelect(userid,uname) {
    $(".hiduserid").val(userid);
    $("#InvestorName").val(uname);
    $(".investorerrortip").hide();
}