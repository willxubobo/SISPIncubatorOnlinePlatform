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
        IsAll:"my"
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
                   pageinit(0, "12", "div_pager");
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
        switch(data[i].status) {
            case "1":
                statustex = "<p class=\"yellow-color\">待审核</p>"; break;
            case "2": statustex = "<p class=\"green-color\">审核通过</p>"; break;
            case "3": statustex = "<p class=\"red-color\">审批驳回</p>";
                operHtml += "<a class=\"operate-btn edit-btn\" href=\"javascript:void(0)\" onclick=\"editfinancingproject('" + data[i].frid + "');\" title='修改'></a><a class=\"operate-btn back-btn\" onclick=\"OpenConfirm('" + data[i].frid + "');\" title='撤销' href=\"javascript:\"></a>"; break;
            case "4":
                statustex = "<p >撤销</p>";break;
        }
        operHtml += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].frid + "')\"></a>";
        operHtml += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].frid + "');\"></a>";
        htmlItem += "<tr>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].productionName + "' class=\"over-txt\">" + data[i].productionName + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + data[i].financingAmount + "</td><td>" + statustex + "</td><td>" + getNowFormatDate(data[i].created) + "</td><td>" + operHtml + "</td>";
        
        htmlItem += "</tr>";
    }
    $('#financingprojectBody').empty();
    $('#financingprojectBody').append(htmlItem);
}
//修改
function editfinancingproject(frid) {
    window.open("financingprojectpublish.html?frid="+frid);
}
//详情
function OpenDetail(id) {
    window.open("financingprojectinfo.html?frid=" + id+"&type=detail");
}
//申请发布
function applypublish() {
    window.open("financingrequirementspublish.html");
}

$(function () {
    InitGetFinancingProjectData();
});

function InitGetFinancingProjectData() {
    pagePagination(1);
}
//打开撤销确认对话框
function OpenConfirm(id) {
    $(".divConfirm").show();
    $("#hidfrid").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidApplyId").val("");
}
//执行撤销功能
function SetRevoke() {

    var id = $("#hidfrid").val();

    ShowLoading();

    var officeObj = {
        FRID: id
    };
    var formObj = {
        "FinancingRequirements": officeObj
    };

    var parameter = {
        requestUri: "/api/financingrequirement/revoke",
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
               $(this).alert("撤销成功");
               
               CloseConfirm();
               HideLoading();
               InitGetFinancingProjectData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}