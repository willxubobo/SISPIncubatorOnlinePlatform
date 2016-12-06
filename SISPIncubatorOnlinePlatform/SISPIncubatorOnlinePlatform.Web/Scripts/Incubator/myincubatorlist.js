//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");


$(function () {
    if (!CheckUserLogin())return;

    ShowLoading();
    GetData();
    InitEventByKeyUp();
});

function InitEventByKeyUp() {
    $("#divSearchCondition").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            SearchByKeys();
        }
    });
}

function GetData() {
    var ps = 10;
    ShowLoading();
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: $("#divSearchCondition").val(),
        UserType: "common"
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
                   GetHtml(results);

                   totalRecords = data.totalCount;
                   pageinit(data.totalCount, ps, "div_pager");

                   if (totalRecords == 0) {
                       $("#divNodata").show();
                   } else {
                       $("#divNodata").hide();
                   }
               }
               else {
                   if (totalRecords == 0) {
                       $("#divNodata").show();
                   } else {
                       $("#divNodata").hide();
                   }
               }
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}
//获取我的孵化器列表的html
function GetHtml(data) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {
        var createdF = new Date(data[i].created);

        htmlItem += "<tr><td>" + data[i].incubatorName + "</td>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].description + "' class=\"over-txt\">" + data[i].description + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + createdF.FormatIncludeZero("yyyy-MM-dd") + "</td>";
        htmlItem += "<td><a class=\"operate-btn edit-btn\" title=\"编辑\" onclick=\"ModifyMyIncubator('" + data[i].incubatorID + "')\" href=\"#\"></a><a class=\"operate-btn detail-btn\" onclick=\"OpenInucubatorInfo('" + data[i].incubatorID + "')\" title=\"查看详情\" href=\"#\"></a> </td></tr>";
    }
    if ($.trim(htmlItem) != "") {
        $("#tbBodyContent").html(htmlItem);
    }

}
function OpenInucubatorInfo(id) {
    window.open('incubatorinfo.html?id=' + id);
}

function SearchByKeys() {
    $('#tbBodyContent').html("");
    pageNo = 1;
    GetData();
}

function ModifyMyIncubator(id) {
    //location.href = 'modifyincubator.html?id=' + id;
    window.open('modifyincubator.html?id=' + id);
}

function pagePagination(p) {
    pageNo = p;
    GetData();
}