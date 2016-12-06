function pagePagination(p) {
    pageNo = p;
    GetlinkData(p - 1, 0);
}

//加载角色
function GetlinkData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo - 1,
        KeyWord: $.trim($("#txtkeyword").val())
    }
    var parameter = {
        requestUri: "/api/linklists",
        requestParameters: searchObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               totalRecords = data.totalCount;
               if (results != null && results != undefined && results.length > 0) {
                   $("#divNodata").hide();
                   GetlinkHtml(results, type);
                   pageinit(totalRecords, "10", "div_pager");
               } else {
                   $('#linkBody').empty();
                   $("#divNodata").show();
                   pageinit(0, "10", "div_pager");
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
function GetlinkHtml(data, type) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {
        var operHtml = "";
        operHtml += "<a class=\"operate-btn edit-btn\" href=\"javascript:void(0)\" onclick=\"editlink('" + data[i].linkID + "');\" title='修改'></a><a class=\"operate-btn remove-btn\" onclick=\"OpenConfirm('" + data[i].linkID + "');\" title='删除' href=\"javascript:\"></a>";
        htmlItem += "<tr>";
        htmlItem += "<td>" + data[i].title + "</td><td>" + data[i].url + "</td>";
        htmlItem += "<td>" + operHtml + "</td>";

        htmlItem += "</tr>";
    }
    $('#linkBody').empty();
    $('#linkBody').append(htmlItem);
}
//修改
function editlink(linkid) {
    window.open("addlink.html?id=" + linkid);
}

$(function () {
    InitGetlinkData();
});

function InitGetlinkData() {
    GetlinkData(pageNo - 1, 0);
}
//打开撤销确认对话框
function OpenConfirm(id) {
    $(".divConfirm").show();
    $("#hidid").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidid").val("");
}
//执行删除功能
function Dellink() {

    var id = $("#hidid").val();

    ShowLoading();

    var officeObj = {
        linkID: id
    };
    var formObj = {
        "Roles": officeObj
    };

    var parameter = {
        requestUri: "/api/linklist/" + id,
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/delete",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (results) {
               $(this).alert("删除成功");

               CloseConfirm();
               HideLoading();
               InitGetlinkData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}