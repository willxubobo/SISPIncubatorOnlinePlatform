

var page = 1;

$(function () {
    GetHomeData(page);
    InitEventByKeyUp();
});

function InitEventByKeyUp() {
    $("#txtCondition").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            SearchData();
        }
    });
}
//获取后台数据
function GetHomeData() {
    ShowLoading();
    var searchObj = {
        PageSize: "13",
        PageNumber: page,
        KeyWord: $.trim($("#txtCondition").val())
    //KeyWord: '123'
}

    var parameter = {
        requestUri: "/api/incubators",
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
                   GetIncubatorListHtml(results);
               }
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}
//获取孵化器列表html
function GetIncubatorListHtml(data) {
    if (data.length > 0) {
        var html = "";
        for (i = 0; i < data.length; i++) {
            var logo = data[i].logo;
            var index = logo.lastIndexOf(".");
            var frontPart = logo.substring(0, index);
            var lastPart = logo.substring(index);
            var newLog = frontPart + "_r" + lastPart;

            if (i < 4) {
                html += "<li  class=\"Inc_li_1_" + (i + 1) + "\"> <img  title='" + data[i].incubatorName + "' src=\"" + newLog + "\" /><input class='hidId' value='" + data[i].incubatorID + "' type=\"hidden\" /></li>";
            } else if (i >= 4 && i <= 8) {
                html += "<li  class=\"Inc_li_2_" + (i - 3) + "\"> <img  title='" + data[i].incubatorName + "' src=\"" + newLog + "\" /><input class='hidId' value='" + data[i].incubatorID + "' type=\"hidden\" /></li>";
            } else if (i > 8 && i <= 12) {
                html += "<li  class=\"Inc_li_3_" + (i - 8) + "\"> <img  title='" + data[i].incubatorName + "' src=\"" + newLog + "\" /><input class='hidId' value='" + data[i].incubatorID + "' type=\"hidden\" /></li>";
            }
        }
        $(".ulIncubatorList").html(html);
        var liObj = $(".ulIncubatorList>li");
        var areaObj = $(".divIncubatorBorder").find("area");

        areaObj.removeAttr("onclick");
        areaObj.removeAttr("title");

        for (var j = 0; j < liObj.length; j++) {
            var id = $(liObj[j]).find(".hidId").val();
            var name = $(liObj[j]).find("img").attr("title");
            $(areaObj[j]).attr("onclick", "OpenIncubatorApply('" + id + "')");
            $(areaObj[j]).attr("title", name);
        }
    } else {
        SearchData();
    }

}

//点击孵化器，打开孵化器详情
function OpenIncubatorApply(id) {
    //CheckUserLogin();
    window.open("incubatorinfo.html?id=" + id);
}
//换一批
function SwitchPatch() {
    var liObj = $(".ulIncubatorList>li");
    if (liObj.length == 13) {
        page = page + 1;
        GetHomeData();
    } else {
        page = 1;
        GetHomeData();
    }
}
//搜索
function SearchData() {
    page = 1;
    GetHomeData();
}
