function pagePagination(p) {
    pageNo = p;
    GetinvesoruserData(p, 0);
}

//加载投资机构
function GetinvesoruserData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo,
        KeyWord: $.trim($("#txtkeyword").val()),
        IsAll: "yes",
        ApproveList: "selectinvestor"
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
               totalRecords = data.totalCount;
               if (results != null && results != undefined && results.length > 0) {
                   $("#divNodata").hide();
                   GetinvesorUserHtml(results, type);
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
function GetinvesorUserHtml(data) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        htmlItem += "<tr>";
        htmlItem += "<td><input type=\"radio\" name=\"investorname\" value=\"" + data[i].userID + "\" title=\"" + data[i].userName + "\"/></td><td>" + data[i].userName + "</td><td>" + data[i].mobile + "</td>";
        htmlItem += "<td>" + data[i].userType + "</td><td><a class='mailtoEmail' href=\"mailto:" + data[i].email + "\">" + data[i].email + "</a></td>";

        htmlItem += "</tr>";
    }
    $('#userBody').empty();
    $('#userBody').append(htmlItem);
}

$(function () {
    InitGetinvesoruserData();
});

function InitGetinvesoruserData() {
    GetinvesoruserData(pageNo);
}
//选择事件
function sureselectuser() {
    var suserid = $("input[name='investorname']:checked").val();
    var susername = $("input[name='investorname']:checked").attr("title");
    if (suserid == null || suserid == undefined || suserid == "") {
        $(this).alert("请选择用户！");
        return;
    } else {
        if (typeof (window.opener.SetUserIDBySelect) == "function") {
            window.opener.SetUserIDBySelect(suserid, susername);
            window.close();
        }
    }
}