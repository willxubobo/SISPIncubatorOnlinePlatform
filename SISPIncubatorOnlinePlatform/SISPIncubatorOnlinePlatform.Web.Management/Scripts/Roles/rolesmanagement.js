function pagePagination(p) {
    pageNo = p;
    GetroleData(p, 0);
}

//加载角色
function GetroleData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo,
        KeyWord: $.trim($("#txtkeyword").val()),
        IsAll: "yes"
    }
    var parameter = {
        requestUri: "/api/roles",
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
               //totalPage = data.totalPage;
               totalRecords = data.totalCount;
               if (results != null && results != undefined && results.length > 0) {
                   $("#divNodata").hide();
                   GetroleHtml(results, type);
                   pageinit(totalRecords, "10", "div_pager");
               } else {
                   $('#roleBody').empty();
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
function GetroleHtml(data, type) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {
        var operHtml = "";
        operHtml += "  <a class=\"operate-btn detail-btn\" title='分配权限' onclick=\"OpenRight('" + data[i].roleID + "')\"></a>";
        operHtml += "<a class=\"operate-btn edit-btn\" href=\"javascript:void(0)\" onclick=\"editrole('" + data[i].roleID + "');\" title='修改'></a><a class=\"operate-btn remove-btn\" onclick=\"OpenConfirm('" + data[i].roleID + "');\" title='删除' href=\"javascript:\"></a>";
        htmlItem += "<tr>";
        htmlItem += "<td>" + data[i].roleName + "</td><td>" + data[i].description + "</td>";
        htmlItem += "<td>" + operHtml + "</td>";

        htmlItem += "</tr>";
    }
    $('#roleBody').empty();
    $('#roleBody').append(htmlItem);
}
//修改
function editrole(roleid) {
    window.open("addrole.html?roleid=" + roleid);
}
//权限分配
function OpenRight(id) {
    window.open("rolerights.html?roleid=" + id);
}


$(function () {
    InitGetroleData();
});

function InitGetroleData() {
    pagePagination(1);
}
//打开撤销确认对话框
function OpenConfirm(id) {
    $(".divConfirm").show();
    $("#hidroleid").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidroleid").val("");
}
//执行删除功能
function Delrole() {

    var id = $("#hidroleid").val();

    ShowLoading();

    var officeObj = {
        roleID: id
    };
    var formObj = {
        "Roles": officeObj
    };

    var parameter = {
        requestUri: "/api/role/" + id,
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
               InitGetroleData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}