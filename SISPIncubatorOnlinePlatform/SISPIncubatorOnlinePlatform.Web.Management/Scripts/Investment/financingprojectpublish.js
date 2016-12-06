
function initfinancingprojectedit() {
    var frid = getUrlParam("frid");
    if (frid != null && frid != undefined && frid != "") {
        ShowLoading();
        $(".lastmenu").html("修改融资项目");
        GetFinancingprojectEditInfo(frid);
    } else {
        $(".lastmenu").html("添加融资项目");
        //if (!CheckUserLogin()) return;
    }
}
$(function () {
    GetIndustry();
    initfinancingprojectedit();
    SetRadioOnly();
});
//根据frid获取信息
function GetFinancingprojectEditInfo(frid) {
    var parameter = {
        "requestUri": "/api/financingrequirement/" + frid,
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
                $("#ProductionName").val(result.results[0].productionName);
                $("#CompanyDescription").val(result.results[0].companyDescription);
                var imglabel = "<img id='imglogocrop' src='" + result.results[0].projectLogo + "' alt='' class='uploadimgshowsize'/> ";
                $(".croplogo").html(imglabel);
                $("#hidlogourl").val(result.results[0].projectLogo);
                //$("#imglogo").show();
                //$("#imglogo").attr("src", result.results[0].projectLogo);
                $("#ProductionDescription").val(result.results[0].productionDescription);
                //$("#Industry").val(result.results[0].industry);
                $(document).find("input[type='checkbox']").each(function () {
                    if (result.results[0].industry.indexOf($(this).val()) != -1) {
                        $(this).prop("checked", "checked");
                    }
                });
                $("#FinancingAmount").val(result.results[0].financingAmount);
                $("#DevelopmentalStage").val(result.results[0].developmentalStage);
                $("#MarketAnalysis").val(result.results[0].marketAnalysis);

                $("#CoreTeam").val(result.results[0].coreTeam);
                $("#OtherInfo").val(result.results[0].otherInfo);
                if (result.results[0].isShow == true) {
                    $(".IsShowIndex").prop("checked", true);
                }
                if (result.results[0].permissionControl == "1") {
                    $("#LoginRadio").attr("checked", "checked");
                }
                else if (result.results[0].permissionControl == "2") {
                    $("#InvestorRadio").attr("checked", "checked");
                }
                else {
                    $("#VistorRadio").attr("checked", "checked");
                }
            }
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}//显示上传
function showuploadprologo() {
    $(".prologodiv").show();
}
//隐藏上传
function hideuploadprologo() {
    $(".prologodiv").hide();
    $("#hidimgname").val("");
    $(".jcrop-active").hide();
}
//上传公司logo
function UploadProLogo() {
    if ($("#fileprologo").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }
    var parameter = {
        "requestUri": "/api/user/file",
        "requestParameters": {
            "LogoUrl": $("#fileprologo").val()
        }
    };

    var parameterJson = JSON.stringify(parameter);

    $.ajaxFileUpload
    (
        {
            url: '/api/proxy/user/ufile', //用于文件上传的服务器端请求地址
            contentType: "application/json; charset=utf-8",
            secureuri: false, //一般设置为false
            fileElementId: 'fileprologo', //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            type: 'post',
            data: { SavePath: 'FinancingFolder', FileExtension: 'FileExtension', LogoSize: 'UserLogoSize', LogoRadio: 'UserLogoRadio' },
            success: function (data, status) //服务器成功响应处理函数
            {
                if (data != null && data != undefined) {
                    if (data.headImgUrl == "error") {
                        $(this).alert("图片格式错误！");
                    } else {
                        $(".logotip").hide();//隐藏
                        var iname = data.headImgUrl.substr(data.headImgUrl.lastIndexOf('/'));
                        $("#hidimgname").val(iname);
                        var imglabel = "<img id='imgCropprologo' src='" + data.sImgUrl + data.headImgUrl + "' alt='' style='width:300px;height:300px;'/> ";
                        $(".imgprologoreview").html(imglabel);
                        var initsize = 200;
                        if (data.xy != null && data.xy != undefined && data.xy != "") {
                            initsize = parseInt(data.xy);
                        }
                        $("#hidxy").val(initsize);
                        $("#hidradio").val(data.radio);
                        initprologojcrop();
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
function cropprologofile() {
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
            "SavePath": "FinancingFolder"
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
            hideuploadprologo();
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
//点击同意协议
function ClickAgree(obj) {
    if (obj.checked) {
        $("#aSubmit").removeClass("grayBtn");
        $("#aSubmit").removeAttr("disabled");
        // $("#aSubmit").attr("onclick", "SubmitFinancingForm();");
        $("#aSubmit").css("cursor", "");
    } else {
        $("#aSubmit").addClass("grayBtn");
        $("#aSubmit").css("cursor", "default");
        $("#aSubmit").prop("disabled", "disabled");
        //$("#aSubmit").removeAttr("onclick");
    }
}

function hideindustrytip() {
    $(".industry").hide();
}
function SubmitFinancingForm() {
    if (!checkarearequire("financingtable")) {
        return false;
    }
    var logourl = $.trim($("#hidlogourl").val());
    if (logourl == "") {
        $(".logotip").show();
        return false;
    } else {
        $(".logotip").hide();
    }
    var productionName = $.trim($("#ProductionName").val());
    var companyDescription = $.trim($("#CompanyDescription").val());
    var productionDescription = $.trim($("#ProductionDescription").val());
    var industry = "";
    $("#tdindustry").find("input[type='checkbox']").each(function () {
        if ($(this).prop("checked") == true) {
            industry += $(this).val() + ",";
        }
    });
    if (industry == "") {
        $(".industry").show();
        return false;
    } else {
        $(".industry").hide();
        industry = industry.substr(0, industry.length - 1);
    }
    ShowLoading();
    var financingAmount = $.trim($("#FinancingAmount").val());
    var developmentalStage = $.trim($("#DevelopmentalStage").val());
    var marketAnalysis = $.trim($("#MarketAnalysis").val());
    var otherInfo = $.trim($("#OtherInfo").val());
    var coreTeam = $.trim($("#CoreTeam").val());
    var frid = getUrlParam("frid");
    if (frid == null || frid == undefined || frid == "") {
        frid = "";
    }
    var IsShowIndex = 0;
    if ($(".IsShowIndex").is(":checked")) {
        IsShowIndex = 1;
    }
    var permissionControl = GetPermissionControl();

    var frPublish = {
        FRID: frid,
        ProductionName: productionName,
        CompanyDescription: companyDescription,
        ProjectLogo: logourl,
        ProductionDescription: productionDescription,
        Industry: industry,
        FinancingAmount: financingAmount,
        DevelopmentalStage: developmentalStage,
        MarketAnalysis: marketAnalysis,
        OtherInfo: otherInfo,
        CoreTeam: coreTeam,
        IsShow: IsShowIndex,
        PermissionControl: permissionControl
    };

    var formObj = {
        "FinancingRequirements": frPublish,
        "AddType": "manager"
    };
    var parameter = {
        requestUri: "/api/financingrequirement",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    var submiturl = "/api/proxy/put";
    if (frid == null || frid == undefined || frid == "") {
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
                window.opener.InitGetFinancingProjectData();
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
function FinancingCancel() {
    window.close();
    // window.location.href = "financingprojectmanagement.html";
}

function storeCoordsprologo(c) {
    jQuery('#X').val(Math.round(c.x));
    jQuery('#Y').val(Math.round(c.y));
    jQuery('#W').val(Math.round(c.w));
    jQuery('#H').val(Math.round(c.h));
};
function initprologojcrop() {
    var initsize = $("#hidxy").val();
    var initradio = $("#hidradio").val();
    jQuery('#imgCropprologo').Jcrop({
        onSelect: storeCoordsprologo,
        bgFade: true,
        bgOpacity: .2,
        setSelect: [0, 0, initsize, initsize],
        boxWidth: 450,
        boxHeight: 450,
        aspectRatio: initradio
    });
}
//获取行业分类信息
function GetIndustry() {
    var formObj = {
        "Key": "Industry"
    };
    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);

    $.ajax({
        type: "post",
        dataType: 'json',
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (data) {
            var results = data.results;
            if (results != null && results != undefined && results.length > 0) {
                var htmlItem = "";
                for (var i = 0; i < results.length; i++) {
                    htmlItem += "<input class=\"check-ipt\" onclick=\"hideindustrytip();\" type=\"checkbox\" value=\"" + results[i].id + "\"/>" + results[i].value + "<br/>";
                }
                htmlItem += "<div class=\"ipt-enter-tips hide industry\">所属行业不能为空！</div>";
                $("#tdindustry").html(htmlItem);
            }
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}
//权限控制单选
function SetRadioOnly() {
    $("#VistorRadio").click(function () {
        $("#LoginRadio").removeAttr("checked");
        $("#InvestorRadio").removeAttr("checked");
        $("#VistorRadio").attr("checked", "checked");
    });
    $("#LoginRadio").click(function () {
        $("#LoginRadio").attr("checked", "checked");
        $("#VistorRadio").removeAttr("checked");
        $("#InvestorRadio").removeAttr("checked");

    });
    $("#InvestorRadio").click(function () {
        $("#InvestorRadio").attr("checked", "checked");
        $("#LoginRadio").removeAttr("checked");
        $("#VistorRadio").removeAttr("checked");

    });
}
//获取权限限制
function GetPermissionControl() {
    var item = $(":radio:checked");
    var permission = item.val();

    return permission;
}