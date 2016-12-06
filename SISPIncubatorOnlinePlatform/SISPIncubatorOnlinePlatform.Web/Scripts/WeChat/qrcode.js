//$(function () {
//    GetSubscribe();
//});
var code = RndNum(9);
function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}

function GetQrData() {
    var parameter = {
        requestUri: "/api/weixin/codeurl/" + code,
        requestParameters: {}
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               if ($("#userlogo")) {
                   $("#userlogo").attr("src", data);
                   if ($("#imglogo_l").length > 0) {
                       $("#imglogo_l").attr("src", data);
                   }
                   if (typeof (window.parent.InitQrCode) == "function") {
                       window.parent.InitQrCode(data);
                   }
               }
               else {
                   $(this).alert("userlogo图标标记未找到！");
               }
           },
           error: function (err) {
               //ErrorResponse(err);
               //HideLoading();
           }
       });
}
//获取用户是否关注
function GetSubscribe() {
    var parameter = {
        requestUri: "/api/weixin/subscribe/" + code,
        requestParameters: {}
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               if (data != null && data != undefined && data.user_mobile != "nodata") {
                   if (data.user_mobile == "showlogin") {
                       $(".hidopenid").val(data.user_name);
                       $(this).loginconfirmPC();
                   } else {
                       InitUserData_Home();
                   }
               }
           },
           error: function (err) {
               //ErrorResponse(err);
               //HideLoading();
           }
       });
}
