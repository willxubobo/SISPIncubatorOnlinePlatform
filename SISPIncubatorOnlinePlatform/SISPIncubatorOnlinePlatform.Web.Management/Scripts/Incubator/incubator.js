$(function () {

    //if (!CheckUserLogin()) return;
    CheckUserLogin();
    InitFormData();

});

function InitFormData() {
    InitLayDate();

    initjcrop();
    //切换是否资金支持
    $(".checkboxfinancial").on("click", function () {
        $(".checkboxfinancial").removeClass("on");
        $(this).addClass("on");
    });
    //切换项目阶段
    $(".checkBoxType").on("click", function () {
        $(".checkBoxType").removeClass("on");
        $(this).addClass("on");
    });

    $("#txtSort").bind("keyup", function () {
        this.value = this.value.replace(/[^\d]/g, ""); //清除"数字"和"."以外的字符
    });

    LoadOtherServices();

    GetRoles();

    var id = getUrlParam("id");
    if ($.trim(id) != "") {
        $("#liMenu").html("修改");
        $("#hidId").val(id);
        $("#hidPageOperdator").val("modify");
        //加载表单数据
        LoadFromData();
    }
}

function InitLayDate() {
    laydate.skin('custom');//切换皮肤，请查看skins下面皮肤库
    var date = {
        elem: '#txtRegTime', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: '1900/01/01', //最小日期
        max: laydate.now(), //最大日期
        start: laydate.now(),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            $("#txtRegTime").next().hide();
        }
    }
    laydate(date);
}
//加载数据
function LoadFromData() {
    var incubatorId = $("#hidId").val();
    var parameter = {
        requestUri: "/api/incubator/" + incubatorId,
        requestParameters: incubatorId
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get/anonymous",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               var logo = results[0].logo;
               var projectList = results[0].incubatorProjects;

               $("#txtIncubatorName").val(results[0].incubatorName);
               //信息介绍
               $("#imgCompanylogo").attr("src", logo);
               $("#imgCompanylogo").show();

               if (results[0].isShow == true) {
                   $(".ulCheckIsShow").find("a").addClass("on");
               }
               $("#txtSort").val(results[0].sort);

               $("#txtOperationAddress").val(results[0].operationAddress);
               $("#txtRegTime").val(results[0].regTime);
               if (results[0].financialSupport == true) {
                   $(".radioBtnYes").prop("checked", true);
                   $(".radioBtnNo").prop("checked", false);
               } else {
                   $(".radioBtnYes").prop("checked", false);
                   $(".radioBtnNo").prop("checked", true);
               }

               $("#txtDescription").val(results[0].description);

               $("#txtService").val(results[0].service);

               $("#txtSiteFavorable").val(results[0].siteFavorable);
               $("#txtSiteFavorable").val(results[0].siteFavorable);

               //处理其他服务
               var otherServices = results[0].otherService;
               var arrayOtherServices = otherServices.split("|");
               $(".lblotherServices").each(function () {
                   var sName = $(this).text();
                   for (var j = 0; j < arrayOtherServices.length; j++) {
                       if (sName == arrayOtherServices[j]) {
                           $(this).prev().addClass("on");
                       }
                   }
               });


               var industryRequirement = results[0].industryRequirement;
               var locationRequirement = results[0].locationRequirement;
               var otherRequirement = results[0].otherRequirement;
               $("#txtIndustryRequirement").val(industryRequirement);
               $("#txtLocationRequirement").val(locationRequirement);
               $("#txtOtherRequirement").val(otherRequirement);
               $("#hidRoleID").val(results[0].roleID);

               $(".selectRoles").val(results[0].roleID);
               $(".selectIpt").select2({
                   minimumResultsForSearch: Infinity
               });
               //$(".selectRoles").select2("val", results[0].roleID);
               //项目详情
               var html = "";

               for (var i = 0; i < projectList.length; i++) {
                   var itemId = guid();
                   var projectType = projectList[i].projectType;
                   var typeName = "已注册";
                   if ($.trim(projectType) == "0") {
                       typeName = "已注册";
                   } else if ($.trim(projectType) == "1") {
                       typeName = "孵化中";
                   } else if ($.trim(projectType) == "2") {
                       typeName = "孵化完成";
                   } else {
                       typeName = "寻求新一轮融资";
                   }

                   html += "<div class=\"add-module-img-box-project projectItem\" style=\"margin-bottom: 10px;\">";
                   html += "                  <div class=\"add-module-img-project\">";
                   html += "                      <img src=\"" + projectList[i].projectPicture + "\" >";
                   html += "                  </div>";
                   html += "                <div class=\"add-module-txt-project\">";
                   html += "                      <div class=\"add-module-name\">" + typeName + "</div>";
                   html += "                             <div class=\"add-module-note\">" + (projectList[i].description.length > 320?projectList[i].description.substring(0,320)+"..." : projectList[i].description) + "</div>";
                   html += "  <div class=\"module-operate-project add-module-operate-project\">";
                   html += " <a onclick='RemoveProjectItem(this)' class=\"module-btn right remove-btn\" \></a>";
                   html += " <a onclick='ModifyProjectItem(this)' class=\"module-btn right edit-btn right20\" \></a>  <input id=\"hidItemProjectImageUrl\" value='" + projectList[i].projectPicture + "' type=\"hidden\"/><input value='" + $.trim(projectType) + "' id=\"hidItemProjectType\" type=\"hidden\" />";
                   html += "  <input type=\"hidden\" class='hidItemsId' id=\"hidItemsId\" value='" + itemId + "'  /></div></div>";
                   html += " </div>";
                   html += " </div>";

               }
               $(".divProjectContainer").append(html);

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//初始化角色选择
function GetRoles() {

    ShowLoading();

    var formObj = {
        Key: "TeamMember",
        PageNumber: 1,
        PageSize: 10000,
        KeyWord: "",
        Type:"admin"
    };

    var parameter = {
        requestUri: "/api/roles",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post/anonymous",
        data: jsonData,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var results = data.results;
            var html = "";
            for (var i = 0; i < results.length; i++) {
                html += "<option value='" + results[i].roleID + "'>" + results[i].roleName + "</option>";
            }
            $(".selectRoles").append(html);

            $(".selectIpt").select2({
                minimumResultsForSearch: Infinity
            });
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//提交
function SubmitForm() {
    var incubatorLogo = $("#imgCompanylogo").attr("src");
    var otherServices = $(".ulOtherServices").find("a.on");
    var a = false;
    if ($.trim(incubatorLogo) == "") {
        $("#divIncubator").show();
        a = true;
    } else {
        $("#divIncubator").hide();
        a = false;
    }
    var b = false;
    //if (otherServices.length <= 0) {
    //    $("#divOtherServices").show();
    //    b = true;
    //} else {
    //    $("#divOtherServices").hide();
    //    b = false;
    //}
    var projectList = $(".projectItem").length;
    var c = false;
    if (projectList <= 0) {
        $("#divProjectListTips").show();
        c = true;
    } else {
        $("#divProjectListTips").hide();
        c = false;
    }
    if (!checkarearequire("divContent") || (a || b || c)) return;
    var op = $("#hidPageOperdator").val();
    if ($.trim(op) == "add") {
        SubmitAndSaveForm();
    } else {
        ReSubmitAndSaveForm();
    }
}
//提交保存
function SubmitAndSaveForm() {

    var projectTmpArry = new Array();
    $(".projectItem").each(function () {
        var type = $(this).find("#hidItemProjectType").val();
        var des = $(this).find(".add-module-note").html();
        var projcteLogo = $(this).find("#hidItemProjectImageUrl").val();
        var fproject = guid();
        //alert($(this).find("#hidItemsmedid").val());
        var detail = {
            ProjectType: type,
            ProjectPicture: projcteLogo,
            Description: des,
            SavePath: "IncubatorProjectFolder",
            FileName: fproject
        }
        projectTmpArry.push(detail);
    });

    var fname = guid();
    var incubatorObj = {
        IncubatorID: $("#hidId").val(),
        IncubatorName: $("#txtIncubatorName").val(),
        OperationAddress: $("#txtOperationAddress").val(),
        RegTime: $("#txtRegTime").val(),
        Logo: $("#imgCompanylogo").attr("src"),
        FinancialSupport: $('.ffYes').attr('class').indexOf('on') > 0,
        Description: $("#txtDescription").val(),
        Service: $("#txtService").val(),
        SiteFavorable: $("#txtSiteFavorable").val(),
        OtherService: GetOtherServices(),
        IndustryRequirement: $("#txtIndustryRequirement").val(),
        LocationRequirement: $("#txtLocationRequirement").val(),
        OtherRequirement: $("#txtOtherRequirement").val(),
        RoleID: $(".selectRoles").val(),
        IsShow: $(".ulCheckIsShow").find("a.on").length > 0,
        Sort: $("#txtSort").val(),
        IncubatorProjects: projectTmpArry
    };

    //alert($(".hidmedid").val());
    var formObj = {
        IncubatorInformation: incubatorObj,
        //IncubatorProjectsDtos: projectTmpArry
    };

    var parameter = {
        requestUri: "/api/incubator",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);
    ShowLoading();
    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert("保存成功");
            setTimeout(function () {
                if (window.opener != null && window.opener.GetData != undefined){
                    window.opener.GetData();
                }
                window.close();
                //location.href = "incubaorlist.html";
            }, 2000);

        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//提交保存
function ReSubmitAndSaveForm() {
   
    var projectTmpArry = new Array();
    $(".projectItem").each(function () {
        var type = $(this).find("#hidItemProjectType").val();
        var des = $(this).find(".add-module-note").html();
        var projcteLogo = $(this).find("#hidItemProjectImageUrl").val();
        var fproject = guid();
        //alert($(this).find("#hidItemsmedid").val());
        var detail = {
            ProjectType: type,
            ProjectPicture: projcteLogo,
            Description: des,
            SavePath: "IncubatorProjectFolder",
            FileName: fproject
        }
        projectTmpArry.push(detail);
    });

    var fname = guid();
    var incubatorObj = {
        IncubatorID: $("#hidId").val(),
        IncubatorName: $("#txtIncubatorName").val(),
        OperationAddress: $("#txtOperationAddress").val(),
        RegTime: $("#txtRegTime").val(),
        Logo: $("#imgCompanylogo").attr("src"),
        FinancialSupport: $('.ffYes').attr('class').indexOf('on') > 0,
        Description: $("#txtDescription").val(),
        Service: $("#txtService").val(),
        SiteFavorable: $("#txtSiteFavorable").val(),
        OtherService: GetOtherServices(),
        IndustryRequirement: $("#txtIndustryRequirement").val(),
        LocationRequirement: $("#txtLocationRequirement").val(),
        OtherRequirement: $("#txtOtherRequirement").val(),
        RoleID: $(".selectRoles").val(),
        IsShow: $(".ulCheckIsShow").find("a.on").length > 0,
        Sort: $("#txtSort").val()
        //IncubatorProjects: projectArry
    };

    //alert($(".hidmedid").val());
    var formObj = {
        IncubatorInformation: incubatorObj,
        IncubatorProjectsDtos: projectTmpArry
    };

    var parameter = {
        requestUri: "/api/incubator/pcweb",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);
    ShowLoading();
    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/put",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert("修改成功");
            setTimeout(function () {
                //location.href = "incubaorlist.html";
                if (window.opener != null && window.opener.GetData != undefined) {
                    window.opener.GetData();
                }
                window.close();
            }, 2000);

        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//打开上传图片窗口
function OpenUoloadFileDialog(type) {
    $("#hidLogType").val(type);
    $(".divlogoPop").show();
}
//取消上传图片窗口
function CloseUoloadFileDialog() {
    $(".divlogoPop").hide();
    jQuery('#hidxy').val("");
    jQuery('#X').val("");
    jQuery('#Y').val("");
    jQuery('#W').val("");
    jQuery('#H').val("");
    $("#hidProjectlogourl").val();
    $(".jcrop-active").hide();
    $("#hidimgname").val("");
}
//选择图片
function AjaxFileUpload() {
    if ($("#file1").val().length <= 0) {
        $(this).alert("请选择图片");
        return false;
    }
    var logtype = $("#hidLogType").val();
    var savePath = 'IncubatorFolder';
    var logSize = 'IncubatorLogoSize';
    if ($.trim(logtype) == "project") {
        savePath = "IncubatorProjectFolder";
        logSize = "IncubatorProjectLogoSize";
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
            data: { SavePath: savePath, FileExtension: 'IncubatorFileExtension', LogoSize: logSize },
            success: function (data, status) //服务器成功响应处理函数
            {
                if (data != null && data != undefined) {
                    if (data.headImgUrl == "error") {
                        $(this).alert("图片格式错误！");
                    } else {
                        $(".logotip").hide();//隐藏
                        var iname = data.headImgUrl.substr(data.headImgUrl.lastIndexOf('/'));
                        $("#hidimgname").val(iname);
                        var imglabel = "<img id='imgCrop' src='" + data.sImgUrl + data.headImgUrl + "' alt='' style='width:300px;height:300px;'/> ";
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
//保存相关参数
function StoreCoords(c) {
    jQuery('#X').val(Math.round(c.x));
    jQuery('#Y').val(Math.round(c.y));
    jQuery('#W').val(Math.round(c.w));
    jQuery('#H').val(Math.round(c.h));
};
//初始化截取图片
function initjcrop() {
    var initsize = $("#hidxy").val();
    jQuery('#imgCrop').Jcrop({
        onSelect: StoreCoords,
        bgFade: true,
        bgOpacity: .2,
        setSelect: [0, 0, initsize, initsize],
        boxWidth: 450,
        boxHeight: 450,
        aspectRatio: 1
    });
}
//截取图片
function CropImage() {
    var logtype = $("#hidLogType").val();

    var savePath = "IncubatorFolder";
    if ($.trim(logtype) == "project") {
        savePath = "IncubatorProjectFolder";
    }

    var iname = $("#hidimgname").val();
    var xy = Math.round($("#W").val()) + "," + Math.round($("#H").val()) + "," + Math.round($("#X").val()) + "," + Math.round($("#Y").val());
    var parameter = {
        "requestUri": "/api/user/cropfile",
        "requestParameters": {
            "ImgName": iname,
            "Xy": xy,
            "SavePath": savePath
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
            CloseUoloadFileDialog();
            var imglabel = "<img id='imglogocrop' src='" + result.sImgUrl + result.headImgUrl + "' alt=''/> ";
            //$(".croplogo").html(imglabel);
            if ($.trim(logtype) == "project") {
                $("#imgProjectlogo").attr("src", result.sImgUrl + result.headImgUrl);
                $("#imgProjectlogo").show();
                $("#hidProjectlogourl").val(result.headImgUrl);
            } else {
                $("#imgCompanylogo").attr("src", result.sImgUrl + result.headImgUrl);
                $("#imgCompanylogo").show();
                $("#hidlogourl").val(result.headImgUrl);
            }
            $(".jcrop-active").hide();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//显示增加项目模块
function ShowProjectModule() {
    $(".divAddContent").show();
    $(".divAdd").hide();
    $("#hidOperdator").val("add");
}
//隐藏增加项目模块
function HideProjectModule() {
    $(".divAddContent").hide();
    $(".divAdd").show();
    $("#hidProjectlogourl").val("");
    $("#txtProjectDes").val("");
    $("#imgProjectlogo").attr("src", "");

    var itemProjectId = $("#hidItemId").val();
    if ($.trim(itemProjectId) != "") {
        $(".hidItemsId").each(function () {
            if (itemProjectId == $(this).val()) {
                $(this).parent().parent().parent().find(".remove-btn").show();
                $(this).parent().parent().parent().find(".edit-btn").show();
            }
        });
    }
}
//增加一条项目
function SaveProjectInfoOk() {
    var projectLogoAllUrl = $("#imgProjectlogo").attr("src");
    var imageUrl = $("#hidProjectlogourl").val();
    var typeObj = $(".checkBoxType.on");
    var projectDes = $("#txtProjectDes").val();
    var a = false;
    var b = false;
    if ($.trim(projectLogoAllUrl) == "") {
        $("#divProjectLogoTips").show();
        a = true;
    } else {
        $("#divProjectLogoTips").hide();
        a = false;
    }

    if ($.trim(projectDes) == "") {
        $("#divProjectDes").show();
        b = true;
    } else {
        $("#divProjectDes").hide();
        b = false;
    }
    if (a || b) {
        return;
    }
    var operType = $("#hidOperdator").val();
    if (operType == "add") {
        var html = "";
        var itemId = guid();
        html += "<div class=\"add-module-img-box-project projectItem\" style=\"margin-bottom: 10px;\">";
        html += "                  <div class=\"add-module-img-project\">";
        html += "                      <img src=\"" + projectLogoAllUrl + "\" >";
        html += "                  </div>";
        html += "                <div class=\"add-module-txt-project\">";
        html += "                      <div class=\"add-module-name\">" + typeObj.next().html() + "</div>";
        html += "                             <div class=\"add-module-note\">" + (projectDes.length > 320 ? projectDes.substring(0, 320) + "..." : projectDes)  + "</div>";
        html += "  <div class=\"module-operate-project add-module-operate-project\">";
        html += " <a onclick='RemoveProjectItem(this)' class=\"module-btn right remove-btn\" \></a>";
        html += " <a onclick='ModifyProjectItem(this)' class=\"module-btn right edit-btn right20\" \></a>  <input id=\"hidItemProjectImageUrl\" value='" + imageUrl + "' type=\"hidden\"/><input value='" + typeObj.attr("id") + "' id=\"hidItemProjectType\" type=\"hidden\" />";
        html += "  <input type=\"hidden\" class='hidItemsId' id=\"hidItemsId\" value='" + itemId + "'  /></div>";
        html += " </div>";
        html += " </div>";
        $(".divProjectContainer").append(html);
    } else {
        var itemProjectId = $("#hidItemId").val();
        $(".hidItemsId").each(function () {
            if (itemProjectId == $(this).val()) {
                $(this).parent().parent().parent().find("img").attr("src", projectLogoAllUrl);
                $(this).parent().parent().parent().find(".add-module-name").html(typeObj.next().html());
                $(this).parent().parent().parent().find(".add-module-note").html(projectDes);
                $(this).parent().parent().parent().find("#hidItemProjectImageUrl").val(imageUrl);
                $(this).parent().parent().parent().find("#hidItemProjectType").val(typeObj.attr("id"));
                $(this).parent().parent().parent().find(".remove-btn").show();
                $(this).parent().parent().parent().find(".edit-btn").show();
            }
        });
    }

    HideProjectModule();
}
//修改项目信息
function ModifyProjectItem(obj) {
    $(obj).hide();
    $(obj).prev().hide();
    ShowProjectModule();
    var imageAllUrl = $(obj).parent().parent().parent().find("img").attr("src");
    $("#imgProjectlogo").attr("src", imageAllUrl);
    $("#imgProjectlogo").show();
    $("#txtProjectDes").val($(obj).parent().parent().parent().find(".add-module-note").html());
    var id = $(obj).parent().parent().parent().find("#hidItemProjectType").val();
    $(".checkBoxType").removeClass("on");
    $(".checkBoxType[id='" + id + "']").addClass("on");
    $("#hidOperdator").val("modify");
    $("#hidItemId").val($(obj).parent().find(".hidItemsId").val());
}
//移除项目信息
function RemoveProjectItem(obj) {
    var index = $(".projectItem").index($(obj).closest(".projectItem"));
    $("#hidIndex").val(index);
    OpenConfirm();
    //$(obj).parent().parent().parent().remove();
}
//加载其他服务选项
function LoadOtherServices() {
    ShowLoading();
    var formObj = {
        Key: "OtherServices",
        PageNumber: 1,
        PageSize: 10000
    };

    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }
    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post/anonymous",
        data: jsonData,
        async:false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var results = data.results;
            var html = "";
            for (var i = 0; i < results.length; i++) {
                html += "<li><a class=\"agreeBtn\" href=\"javascript:;\"></a><label class=\"rulesTxt lblotherServices\">" + results[i].value + "</label></li>";
            }
            $(".ulOtherServices").append(html);
            $(".choseBtn,.agreeBtn").click(function () {
                $(this).toggleClass("on");
                $("#divOtherServices").hide();
            });

            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//获取其他服务的数据
function GetOtherServices() {
    var other = "";
    $(".lblotherServices").each(function () {
        if ($(this).prev(".on").length > 0) {
            other = other + "|" + $(this).text();
        }
    });
    return other;
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidIndex").val("");
}
//打开撤销确认对话框
function OpenConfirm() {
    $(".divConfirm").show();
}
//执行删除
function DeleteProject() {
    var index = $("#hidIndex").val();
    if ($.trim(index) != "") {
        $($(".projectItem")[index]).remove();
    }
    CloseConfirm();
}
