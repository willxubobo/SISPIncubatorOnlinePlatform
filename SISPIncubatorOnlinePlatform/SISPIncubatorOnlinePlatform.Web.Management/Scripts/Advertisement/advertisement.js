//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");


$(function () {
    //if (!CheckUserLogin())return;
    InitData();
    //ShowLoading();
});


function InitData() {
    LoadShowModule();

    $("#txtSort").bind("keyup", function () {
        this.value = this.value.replace(/[^\d]/g, ""); //清除"数字"和"."以外的字符
    });

    $(".agreeBtn,.ashowmodule,.btnEffective").click(function () {
        $(this).toggleClass("on");
    });

    var id = getUrlParam("id");
    if ($.trim(id) != "") {
        $("#hidId").val(id);
        LoadFromData();
        
    }
}

//加载表单数据
function LoadFromData() {
    var id = $("#hidId").val();

    var parameter = {
        requestUri: "/api/advertisement/" + id,
        requestParameters: id
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
               var pic = results[0].picture;
               if ($.trim(pic) == "") {
                   pic = results[0].url;
               }
               $("#imgShow").attr("src", pic);
               $("#trShowImg").show();
               $("#txtInternatImageUrl").val(results[0].url);
               $("#txtDescription").val(results[0].description);
               $("#txtSort").val(results[0].sort);
               if (results[0].status == "1") {
                   $(".ulIsEffective").find("a").addClass("on");
               }else
               {
                   $(".ulIsEffective").find("a").removeClass("on");
               }
               if (results[0].status == "1") {
                   $(".ulIsEffective").find("a").addClass("on");
               } else {
                   $(".ulIsEffective").find("a").removeClass("on");
               }
               var modules = results[0].module.split(";");
               $(".ashowmodule").removeClass("on");
               for (var i = 0; i < modules.length; i++) {
                   if ($.trim(modules[i]) != "") {
                       var module = modules[i];
                       $(".ulShowModule").find("label").each(function() {
                           if (module == $(this).text()) {
                               $(this).prev().addClass("on");
                           }
                       });
                   }
               }
               

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//加载其他服务选项
function LoadShowModule() {
    ShowLoading();
    var formObj = {
        Key: "AdvertisementModule",
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
                html += "<li><a class=\"agreeBtn ashowmodule on\" href=\"javascript:;\"></a><label class=\"rulesTxt lblotherServices\">" + results[i].value + "</label></li>";
            }
            $(".ulShowModule").append(html);

            $(".ashowmodule").click(function () {
                $(this).toggleClass("on");
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
    var file = $("#fileAdvertisement").val();
    var isExistUrl = $("#imgShow").attr("src");
    if ($.trim(file) == "" && $.trim(isExistUrl) == "") {
        $(this).alert("图片地址不能为空");
        return;
    } else {
       if ($.trim(file) != "") {
           var index = file.lastIndexOf(".");
           var lastPart = file.substring(index);
           var exp = /.jpg$|.gif$|.png$|.bmp$/;
           if (exp.exec(lastPart.toLowerCase()) == null) {
               $(this).alert("请选择正确的图片格式");
               return;
           }
       }

    }
    if ($(".ashowmodule.on").length <= 0) {
        $(this).alert("请选择展示模块");
        return;
    }
    if (!checkarearequire("divContent")) return;
    SubmitAndSaveForm();
}
//保存
function SubmitAndSaveForm() {

    ShowLoading();
    $.ajaxFileUpload({
        url: '/api/proxy/addAdvertisement', //用于文件上传的服务器端请求地址
        contentType: "application/json; charset=utf-8",
        secureuri: false, //一般设置为false
        fileElementId: "fileAdvertisement", //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'json', //返回值类型 一般设置为json
        type: 'post',
        data: {
            IncubatorApplyId: $("#hidId").val(),
            AdDescription: $("#txtDescription").val(),
            AdInternertUrl: $("#txtInternatImageUrl").val(),
            AdSort: $("#txtSort").val(),
            AdIsShow: $(".ulCheckIsShow").find("a.on").length > 0,
            AdModule: GetModule(),
            AdIsEffective: $(".ulIsEffective").find("a.on").length>0
        },
        success: function (data, status) //服务器成功响应处理函数
        {
            HideLoading();
            
            if (data['headImgUrl'] != undefined && data['headImgUrl'] != null && data['headImgUrl'] == "success") {
                $(this).alert("保存成功");
                setTimeout(function () {
                    if (window.opener != null) {
                        window.opener.GetData();
                    }
                    window.close();
                }, 2000);
            } else {
                $(this).alert("保存失败,请检查");
                setTimeout(function () {
                    window.close();
                }, 2000);
            }

        },
        error: function (data, status, e) //服务器响应失败处理函数
        {
            $(this).alert(e);
        }
    });
}
//得到模块
function GetModule() {
    var mm = "";
    $(".ulShowModule").find("a.on").each(function() {
        mm = mm + ";" + $(this).next().text();
    });
    return mm;
}