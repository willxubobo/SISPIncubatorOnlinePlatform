//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");


$(function () {
    //if (!CheckUserLogin())return;
    CheckUserLogin();
    ShowLoading();
    GetData();
});

function GetData() {

    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: ""
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/incubators/pcprojectreport",
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
                   pageinit(data.totalCount, ps, "divpager");

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
//获取我的项目统计的html
function GetHtml(data) {
    
    for (i = 0; i < data.length; i++) {
        var htmlItem = "";
        //htmlItem += "<tr><td><input class=\"base-checkbox chkItem\" value='" + data[i].incubatorID + "' onclick='ChkItem()' type=\"checkbox\"></td>";
        htmlItem += "<tr><td><div class=\"over-txt-p\"><div title='" + data[i].incubatorName + "' class=\"over-txt\">" + data[i].incubatorName + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].incubatorDes + "' class=\"over-txt\">" + data[i].incubatorDes + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + data[i].projectRegisteredCount + "</td>";
        htmlItem += "<td>" + data[i].projectHatchingCount + "</td>";
        htmlItem += "<td>" + data[i].projectIncubatoredCount + "</td>";
        htmlItem += "<td>" + data[i].projectSeekFinancingCount + "</td>";
        htmlItem += "<td><a class=\"operate-btn detail-btn\" onclick=\"OpenInucubatorInfo('" + data[i].incubatorID + "')\" title=\"查看详情\" href=\"#\"></a> </td></tr>";
        $("#tbBodyContent").append(htmlItem);
    }
}
//打开孵化器详情
function OpenInucubatorInfo(id) {
    window.open('/Incubator/incubatorinfo.html?id=' + id);
}

function SearchByKeys() {
    $('#tbBodyContent').html("");
    pageNo = 1;
    GetData();
}
//修改
function ModifyMyIncubator(id) {
    //location.href = 'modifyincubator.html?id=' + id;
    window.open('/Incubator/incubator.html?id=' + id);
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetData();
}
//全选
function ChkAll(obj) {
    if (obj.checked) {
        $(".chkItem").prop("checked", true);
    } else {
        $(".chkItem").prop("checked", false);
    }
}
//单项选择
function ChkItem() {
    if ($(".chkItem:checked").length == $(".chkItem").length) {
        $(".chkAll").prop("checked", true);
    } else {
        $(".chkAll").prop("checked", false);
    }
}
//导出excel
function ExportExcel() {
    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: ""
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/incubators/exportprojectreport",
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
               if (data.fileUrl != null && data.fileUrl != "") {

                   var iframe = document.createElement("iframe");

                   iframe.src = data.fileUrl;
                   // This makes the IFRAME invisible to the user.
                   iframe.style.display = "none";
                   // Add the IFRAME to the page.  This will trigger
                   //   a request to GenerateFile now.
                   document.body.appendChild(iframe);
               }
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}