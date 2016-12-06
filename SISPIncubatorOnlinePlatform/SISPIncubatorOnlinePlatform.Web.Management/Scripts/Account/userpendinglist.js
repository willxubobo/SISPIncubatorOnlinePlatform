function pagePagination(p) {
    pageNo = p;
    GetuserData(p - 1, 0);
}

//加载投资机构
function GetuserData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo - 1,
        KeyWord: $.trim($("#txtkeyword").val()),
        ApproveList: "true"
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
        //operHtml += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].userID + "')\"></a>";
        operHtml += "<a class=\"operate-btn approve-btn\" href=\"javascript:void(0)\" onclick=\"edituser('" + data[i].userID + "');\" title='审批'></a>";
        htmlItem += "<tr>";
        htmlItem += "<td>" + data[i].userName + "</td><td>" + data[i].mobile + "</td>";
        htmlItem += "<td><a class='mailtoEmail' href=\"mailto:" + data[i].email + "\">" + data[i].email + "</a></td><td>" + getNowFormatDate(data[i].created) + "</td><td>" + operHtml + "</td>";

        htmlItem += "</tr>";
    }
    $('#userBody').empty();
    $('#userBody').append(htmlItem);
}
//审批
function edituser(userid) {
    window.open("userapprove.html?userid=" + userid);
}
//详情
function OpenDetail(id) {
    window.open("userinfo.html?userid=" + id);
}


$(function () {
    InitGetuserData();
});

function InitGetuserData() {
    pagePagination(1);
}
