

var page = 1;

$(function () {
    GetHomeData(page);
});

function GetHomeData() {

    var searchObj = {
        PageSize: "10000",
        PageNumber: "1",
        KeyWord: "",
        UserType:"home"
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/incubators/pcweb",
        requestParameters: searchObj
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
               var results = data.results;
               if (results) {
                   GetHomeIncubatorHtml(results);                  
               }
               InitPlug();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

function GetHomeIncubatorHtml(data) {
    for (i = 0; i < data.length; i++) {
        var logo = data[i].logo;
        var index = logo.lastIndexOf(".");
        var frontPart = logo.substring(0, index);
        var newLog = frontPart + "_m.jpg";
        var html = "";
        html += "<li onclick=\"OpenIncubatorApply('" + data[i].incubatorID + "');\"><div class='slideImgContainer'><div class='divSlideImg'><span><img src=\"" + newLog + "\" onload=\"AutoResizeImage(200,200,this)\" /></span></div><div>" + data[i].incubatorName + "</div><div></li>";
        $(".incubatorHomeList").append(html);
    }
}
