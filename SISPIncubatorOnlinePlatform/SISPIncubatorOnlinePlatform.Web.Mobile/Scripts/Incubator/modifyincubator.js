$(function() {
    //判断是否登陆
    CheckUserLogin();

    $(".choseBtn,.agreeBtn").click(function () {
        $(this).toggleClass("on");
    });

    InitDate();

    LoadOtherServices();


    var id = getUrlParam("id");
    if ($.trim(id) != "") {
        $("#hidId").val(id);
        //加载表单数据
        LoadFromData();
    }

});

function InitDate() {
    //初始化日期选择
    $(".birthdayIpt,#startTime,#endTime").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        dateFormat: "yy-mm-dd"
    });
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
               $("#imglogo").attr("src", logo);
               $("#imglogo").show();

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
                       typeName = "寻求融资";
                   }
                   html += "<div class=\"baseInfoBox\"><div class=\"alterPic\"><img src='" + projectList[i].projectPicture + "' id='imgItemProjectLogo' alt=\"\" /></div>";
                   html += "<div class=\"educationInfo alterTxt\"><p class=\"educationInfoTxt pTypeName\" id='pTypeName'>" + typeName + "</p><p class=\"educationInfoTxt pProjectDes\">" + projectList[i].description + "</p></div><a class=\"editEduBtn\" onclick=\"ModifyLayer(this);\" href=\"javascript:;\"></a><a class=\"removeEduBtn\" onclick=\"RomeProjectItem(this);\" href=\"javascript:;\"></a>";
                   html += "<input type=\"hidden\" id=\"hidItemslocalid\"  /><input type=\"hidden\" id=\"hidItemsmedid\"  /><input type=\"hidden\" id=\"hidItemsType\" value='" + projectType + "'  /><input type=\"hidden\" id=\"hidItemsId\" value='" + itemId + "'  /></div>";
               }
               $(".divProjectList").append(html);

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//提交保存
function SubmitAndSaveForm() {
    var incubatorLogo = $("#imglogo").attr("src");
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
    if (otherServices.length <= 0) {
        $("#divOtherServices").show();
        b = true;
    } else {
        $("#divOtherServices").hide();
        b = false;
    }
    var projectList = $(".divProjectList").find(".baseInfoBox").length;
    var c = false;
    if (projectList <= 0) {
        $("#divProjectListTips").show();
        c = true;
    } else {
        $("#divProjectListTips").hide();
        c = false;
    }
    if (!checkrequire() || (a || b || c)) return;

    //var projectArry = new Array();
    //$(".divProjectList").find(".baseInfoBox").each(function () {
    //    var type = $(this).find("#hidItemsType").val();
    //    var des = $(this).find(".pProjectDes").text();
    //    var projcteLogo = "../images/f1.png";
    //    var detail = {
    //        ProjectType: type,
    //        ProjectPicture: projcteLogo,
    //        Description: des,
    //    }
    //    projectArry.push(detail);
    //});

    var projectTmpArry = new Array();
    $(".divProjectList").find(".baseInfoBox").each(function () {
        var type = $(this).find("#hidItemsType").val();
        var des = $(this).find(".pProjectDes").text();
        var projcteLogo = $(this).find("#imgItemProjectLogo").attr("src");
        var fproject = guid();
        //alert($(this).find("#hidItemsmedid").val());
        var detail = {
            ProjectType: type,
            ProjectPicture: projcteLogo,
            Description: des,
            SavePath: "IncubatorProjectFolder",
            MediaID: $(this).find("#hidItemsmedid").val(),
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
        Logo: $("#imglogo").attr("src"),
        FinancialSupport: $(".radioBtnYes").prop("checked"),
        Description: $("#txtDescription").val(),
        Service: $("#txtService").val(),
        SiteFavorable: $("#txtSiteFavorable").val(),
        OtherService: GetOtherServices(),
        IndustryRequirement: $("#txtIndustryRequirement").val(),
        LocationRequirement: $("#txtLocationRequirement").val(),
        OtherRequirement: $("#txtOtherRequirement").val(),
        RoleID:$("#hidRoleID").val(),
        //IncubatorProjects: projectArry
    };

    var weixin = {
        SavePath: "IncubatorFolder",
        MediaID: $(".hidmedid").val(),
        FileName: fname
    };
    //alert($(".hidmedid").val());
    var formObj = {
        IncubatorInformation: incubatorObj,
        WeiXinRequest: weixin,
        IncubatorProjectsDtos: projectTmpArry
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
       url: "/api/proxy/put",
       data: jsonData,
       contentType: "application/json; charset=utf-8",
       success: function (results) {
           $(this).alert("修改成功");
           setTimeout(function() {
               location.href = "myincubatorlist.html";
           }, 2000);
       },
       error: function (err) {
           ErrorResponse(err);
       }
   });
}
//调用微信拍照接口,限上传一张照片,上传项目logo调用
function GetProjectPic() {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            $("#imgProjectlogo").attr("src", localIds);

            $("#imgProjectlogo").show();

            $("#hidItemlocalid").val(localIds);
            $("#divProjectTips").hide();
            wx.uploadImage({
                localId: '' + localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    $("#hidItemmedid").val(serverId);
                }
            });
        }
    });
}

//调用微信拍照接口,限上传一张照片,上传孵化器logo调用
function GetIncubatorPic() {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            $("#imglogo").attr("src", localIds);
            $("#imglogo").show();
            $(".hidlocalid").val(localIds);
            $(".divIncubator").hide();
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
//获取其他服务的数据
function GetOtherServices() {
    var other = "";
    $(".lblotherServices").each(function() {
        if ($(this).prev(".on").length > 0) {
            other = other + "|" + $(this).text();
        }
    });
    return other;
}

//取消
function Cancel() {
   window.location.href = "myincubatorlist.html";
}
/****弹出层操作开始****/
//新增项目信息
function OpenLayer() {
    $("#hidOperdator").val("add");
    $(".popupDiv").removeClass("hide");
}
//保存弹出层数据
function SaveOk() {
    if (CheckLayerValidate()) return;
    var operator = $("#hidOperdator").val();

    var typeName = $(".projectType:checked").next().text();

    var type = "0";
    if ($.trim(typeName) == "已注册") {
        type = "0";
    } else if ($.trim(typeName) == "孵化中") {
        type = "1";
    }
    else if ($.trim(typeName) == "孵化完成") {
        type = "2";
    } else {
        type = "3";
    }
    if (operator == "add") {
        var itemId = guid();

        var html = "<div class=\"baseInfoBox\"><div class=\"alterPic\"><img src='" + $("#imgProjectlogo").attr("src") + "' id='imgItemProjectLogo' alt=\"\" /></div>";
        html += "<div class=\"educationInfo alterTxt\"><p class=\"educationInfoTxt pTypeName\">" + typeName + "</p><p class=\"educationInfoTxt pProjectDes\">" + $("#txtProjectDes").val() + "</p></div><a class=\"editEduBtn\" onclick=\"ModifyLayer(this);\" href=\"javascript:;\"></a><a class=\"removeEduBtn\" onclick=\"RomeProjectItem(this);\" href=\"javascript:;\"></a>";
        html += "<input type=\"hidden\" id=\"hidItemslocalid\" value='" + $("#hidItemlocalid").val() + "'  /><input type=\"hidden\" value='" + $("#hidItemmedid").val() + "' id=\"hidItemsmedid\"  /><input type=\"hidden\" id=\"hidItemsType\" value='" + type + "'  />" +
            "<input type=\"hidden\" id=\"hidItemsId\" value='" + itemId + "'  /></div>";
        $(".divProjectList").prepend(html);
    } else {
        var itemGuid = $("#hidItemsGuid").val();
        if ($.trim(itemGuid) != "") {
            $(".divProjectList").find(".baseInfoBox").each(function () {
                var itemId = $(this).find("#hidItemsId").val();
                if (itemId == itemGuid) {
                    $(this).find("#imgItemProjectLogo").attr("src", $("#imgProjectlogo").attr("src"));
                    $(this).find(".pTypeName").text(typeName);
                    $(this).find(".pProjectDes").text($("#txtProjectDes").val());
                    $(this).find("#hidItemslocalid").val($("#hidItemlocalid").val());
                    $(this).find("#hidItemsmedid").val($("#hidItemmedid").val());

                    //alert($("#hidItemmedid").val());
                    $(this).find("#hidItemsType").val(type);
                }
            });
        }
    }
    $("#divProjectListTips").hide();
    CloseLayer();
}
//关闭弹出层
function CloseLayer() {
    $(".popupDiv").addClass("hide");
    ClearLayerData();
}

//清空弹出层的数据
function ClearLayerData() {
    $("#imgProjectlogo").attr("src", "");
    $("#txtProjectDes").val("");

    $("#hidItemlocalid").val("");
    $("#hidItemmedid").val("");

    $("#divProjectTips").hide();
    $("#divProjectDes").hide();
}
//验证碳储层的必填项
function CheckLayerValidate() {
    var projectLogo = $("#imgProjectlogo").attr("src");
    var projectDes = $("#txtProjectDes").val();
    var a = true;
    var b = true;
    if ($.trim(projectLogo) == "") {
        $("#divProjectTips").show();
        a = true;
    } else {
        $("#divProjectTips").hide();
        a = false;
    }
    if ($.trim(projectDes) == "") {
        $("#divProjectDes").show();
        b = true;
    } else {
        $("#divProjectDes").hide();
        b = false;
    }
    return a || b;
}
//修改某条项目
function ModifyLayer(obj) {
    $("#hidOperdator").val("modify");
    $(".popupDiv").removeClass("hide");

    var type = $(obj).parent().find("#pTypeName").text();
    $(".projectType").each(function() {
        var typeName = $(this).next().text();
        if ($.trim(typeName) == type) {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });
    $("#imgProjectlogo").removeClass("hide");
    $("#imgProjectlogo").attr("src", $(obj).parent().find("#imgItemProjectLogo").attr("src"));
    $("#txtProjectDes").val($(obj).parent().find(".pProjectDes").text());
    $("#hidItemlocalid").val($(obj).parent().find("#hidItemslocalid").val());
    $("#hidItemmedid").val($(obj).parent().find("#hidItemsmedid").val());
    var itemGuid = $(obj).parent().find("#hidItemsId").val();
    $("#hidItemsGuid").val(itemGuid);
}
//删除某条项目
function RomeProjectItem(obj) {
    $(obj).parent().remove();
}
/****弹出层操作结束****/