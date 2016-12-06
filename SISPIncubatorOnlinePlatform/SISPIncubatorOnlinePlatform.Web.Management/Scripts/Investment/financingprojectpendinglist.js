function pagePagination(p) {
    pageNo = p;
    GetFinancingProjectData(p - 1, 0);
}

//加载投资机构
function GetFinancingProjectData(page, type) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo - 1,
        KeyWord: $.trim($("#txtkeyword").val()),
        ApproveList: "true",
        Status: $(".selectIpt").val()
    }
    var parameter = {
        requestUri: "/api/financingrequirements",
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
                   $('#financingprojectBody').empty();
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
            case "3": statustex = "<p class=\"red-color\">审核驳回</p>"; break;
            case "4":
                statustex = "<p >撤销</p>"; break;
        }
        //operHtml += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].frid + "')\"></a>";
        operHtml += "<a class=\"operate-btn approve-btn\" href=\"javascript:void(0)\" onclick=\"editfinancingproject('" + data[i].frid + "');\" title='审批'></a>";
        htmlItem += "<tr>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].productionName + "' class=\"over-txt\">" + data[i].productionName + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + data[i].financingAmount + "</td><td>" + getNowFormatDate(data[i].created) + "</td><td>" + statustex + "</td><td>" + operHtml + "</td>";

        htmlItem += "</tr>";
    }
    $('#financingprojectBody').empty();
    $('#financingprojectBody').append(htmlItem);
}
//审批
function editfinancingproject(frid) {
    window.open("financingprojectapprove.html?frid=" + frid);
}
//详情
function OpenDetail(id) {
    window.open("financingprojectdetail.html?frid=" + id+"&type=pending");
}
//申请发布
function applypublish() {
    window.open("financingrequirementspublish.html");
}

$(function () {
    InitGetFinancingProjectData();
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
});

function InitGetFinancingProjectData() {
    pageNo = 1;
    GetFinancingProjectData(pageNo - 1, 0);
}

