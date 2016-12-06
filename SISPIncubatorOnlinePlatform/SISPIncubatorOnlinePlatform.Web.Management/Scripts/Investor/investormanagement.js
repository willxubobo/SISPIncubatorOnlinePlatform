function pagePagination(p) {
    pageNo = p;
    GetinvestorData(p - 1, 0);
}

//加载投资机构
function GetinvestorData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo - 1,
        KeyWord: $.trim($("#txtkeyword").val()),
        IsAll: "yes",
        Status: $(".selectIpt").val()
    }
    var parameter = {
        requestUri: "/api/investorinformations",
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
                   GetInvestHtml(results, type);
                   pageinit(totalRecords, "10", "div_pager");
               } else {
                   $('#investorBody').empty();
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
function GetInvestHtml(data, type) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {
        var statustex = "";
        var operHtml = "";
        switch (data[i].status) {
            case "1":
                statustex = "<p class=\"yellow-color\">待审核</p>"; break;
            case "2": statustex = "<p class=\"green-color\">审核通过</p>"; break;
            case "3": statustex = "<p class=\"red-color\">审批驳回</p>"; break;
            case "4":
                statustex = "<p >撤销</p>"; break;
        }
        operHtml += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].userID + "')\"></a>";
        operHtml += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].userID + "');\"></a>";
        operHtml += "<a class=\"operate-btn edit-btn\" href=\"javascript:void(0)\" onclick=\"editinvestor('" + data[i].userID + "');\" title='修改'></a><a class=\"operate-btn remove-btn\" onclick=\"OpenConfirm('" + data[i].userID + "');\" title='删除' href=\"javascript:\"></a>";
        htmlItem += "<tr>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].companyName + "' class=\"over-txt\">" + data[i].companyName + "</div><div class=\"run-over\">...</div></div></td><td>" + data[i].investorName + "</td>";
        htmlItem += "<td>" + data[i].investmentStageName + "</td><td>" + statustex + "</td><td>" + operHtml + "</td>";

        htmlItem += "</tr>";
    }
    $('#investorBody').empty();
    $('#investorBody').append(htmlItem);
}
//修改
function editinvestor(frid) {
    window.open("investorauth.html?userid=" + frid);
}
//详情
function OpenDetail(id) {
    window.open("investorinfo.html?id=" + id);
}


$(function () {
    InitGetinvestorData();
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
});

function InitGetinvestorData() {
    pageNo = 1;
    GetinvestorData(pageNo - 1, 0);
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
//执行删除功能
function Delinvestor() {

    var id = $("#hiduserid").val();

    ShowLoading();

    var officeObj = {
        UserID: id
    };
    var formObj = {
        "InvestorInformation": officeObj
    };

    var parameter = {
        requestUri: "/api/investorinformation/" + id,
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
               InitGetinvestorData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}