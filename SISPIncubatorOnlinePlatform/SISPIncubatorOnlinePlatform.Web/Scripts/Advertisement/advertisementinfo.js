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

    var id = getUrlParam("id");
    if ($.trim(id) != "") {
        $("#hidId").val(id);
        LoadFromData();
        AddTraffic();
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
               $("#txtInternatImageUrl").html(results[0].url);
               $("#txtDescription").html(results[0].description);
               $("#txtSort").html(results[0].sort);
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
                html += "<li style='float:left;margin-right:20px;'><a class=\"agreeBtn ashowmodule on\"  href=\"javascript:;\"></a><label class=\"rulesTxt lblotherServices\">" + results[i].value + "</label></li>";
            }
            $(".ulShowModule").append(html);


            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//增加点击量
function AddTraffic() {
    var id = $("#hidId").val();

    var parameter = {
        requestUri: "/api/advertisement/" + id,
        requestParameters: ""
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}