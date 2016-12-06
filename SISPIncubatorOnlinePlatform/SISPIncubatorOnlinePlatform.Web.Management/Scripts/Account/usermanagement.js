function pagePagination(p) {
    pageNo = p;
    GetuserData(p, 0);
}

//加载投资机构
function GetuserData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo,
        KeyWord: $.trim($("#txtkeyword").val()),
        ApproveList: "managerall",
        Status: $(".selectIpt").val()
    }
    var parameter = {
        requestUri: "/api/users",
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
                   GetUserHtml(results, type);
                   pageinit(totalRecords, "10", "div_pager");
               } else {
                   $('#userBody').empty();
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
function GetUserHtml(data, type) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {
        var statustex = "";
        var operHtml = "";
        //switch (data[i].status) {
        //    case "1":
        //        statustex = "<p class=\"yellow-color\">待审核</p>"; break;
        //    case "2": statustex = "<p class=\"green-color\">审核通过</p>"; break;
        //    case "3": statustex = "<p class=\"red-color\">审批驳回</p>"; break;
        //    case "4":
        //        statustex = "<p >撤销</p>"; break;
        //}
        operHtml += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].userID + "')\"></a>";
        //operHtml += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].userID + "');\"></a>";
        operHtml += "<a class=\"operate-btn edit-btn\" href=\"javascript:void(0)\" onclick=\"edituser('" + data[i].userID + "');\" title='修改'></a><a class=\"operate-btn reset-btn\" onclick=\"OpenResetConfirm('" + data[i].userID + "');\" title='重置密码' href=\"javascript:\"></a><a class=\"operate-btn remove-btn\" onclick=\"OpenConfirm('" + data[i].userID + "');\" title='删除' href=\"javascript:\"></a>";
        htmlItem += "<tr>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].userName + "' class=\"over-txt\">" + data[i].userName + "</div><div class=\"run-over\">...</div></div></td><td>" + data[i].mobile + "</td>";
        htmlItem += "<td>" + data[i].userType + "</td><td><a class='mailtoEmail' href=\"mailto:" + data[i].email + "\">" + data[i].email + "</a></td><td>" + operHtml + "</td>";

        htmlItem += "</tr>";
    }
    $('#userBody').empty();
    $('#userBody').append(htmlItem);
}
//修改
function edituser(userid) {
    window.open("adduser.html?userid=" + userid);
}
//详情
function OpenDetail(id) {
    window.open("userinfo.html?userid=" + id);
}


$(function () {
    InitGetuserData();
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
});

function InitGetuserData() {
    pagePagination(1);
}
//打开撤销确认对话框
function OpenConfirm(id) {
    $(".divConfirm").show();
    $("#hiduserid").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hiduserid").val("");
}
function OpenResetConfirm(id) {
    $(".divResetConfirm").show();
    $("#hiduserid").val(id);
}
function CloseResetConfirm() {
    $(".divResetConfirm").hide();
    $("#hiduserid").val("");
}
//执行删除功能
function Deluser() {
    var id = $("#hiduserid").val();
    ShowLoading();
    var officeObj = {
        UserID: id
    };
    var formObj = {
        "userInformation": officeObj
    };
    var parameter = {
        requestUri: "/api/user/" + id,
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
               InitGetuserData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

//执行重置密码功能
function resetuserpwd() {
    var id = $("#hiduserid").val();
    ShowLoading();
    var officeObj = {
        UserID: id
    };
    var formObj = {
        "userInformation": officeObj
    };
    var parameter = {
        requestUri: "/api/user/" + id,
        requestParameters: formObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (results) {
               $(this).alert("密码重置成功");
               CloseResetConfirm();
               HideLoading();
               //InitGetuserData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}