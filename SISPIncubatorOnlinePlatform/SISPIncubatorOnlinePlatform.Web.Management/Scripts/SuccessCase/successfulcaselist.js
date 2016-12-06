$(function () {
    pagePagination(1);
})
function pagePagination(p) {
    pageNo = p;
    InitData(pageNo - 1);
}
function InitData(page) {
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        Status: 5,
        searchString: $("#searchCaseValue").val()
    }
    var parameter = {
        requestUri: "/api/successfulcases",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result.results.length > 0) {
                $("#divNodata").hide();
                GetHtml(result.results);
            } else {
                $("#activityBody").empty();
                $("#divNodata").show();
            }
            pageinit(result.totalCount, "10", "div_pager", "pagePagination");
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function SearchCaseData() {
    $("#activityBody").empty();
    $("#searchCaseValue").val($.trim($("#txtkeyword").val()));
    pagePagination(1);
}
function GetHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {

        var caseID = data[i].caseID;
        var title = data[i].title;
        var category = data[i].category;
        var status = data[i].status;
        if (status == true) {
            status = "显示";
        }
        else {
            status = "不显示";
        }
        html += " <tr class=" + caseID + ">";
        html += "<td>" + title + "</td><td>" + category + "</td>";
        if (status == "显示") {
            html += "<td><p class='green-color'>" + status + "</p></td>";
        }
        if (status == "不显示") {
            html += "<td><p class='red-color'>" + status + "</p></td>";
        }
        html += "<td><a class='operate-btn edit-btn' onclick=\"editcase('" + caseID + "')\"></a><a class='operate-btn detail-btn' onclick=\"OpenDetail('" + caseID + "')\"></a><a class='operate-btn remove-btn' onclick=\"OpenConfirm('" + caseID + "')\"></a></td></tr>"
    }
    $("#activityBody").empty();
    $("#activityBody").append(html);
}

//打开撤销确认对话框
function OpenConfirm(id) {
    $(".divConfirm").show();
    $("#hidfrid").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidfrid").val("");
}
//审批
function editcase(id) {
    window.open("successfulcase.html?id=" + id);
}
//详情
function OpenDetail(id) {
    window.open("successfulcasedetail.html?id=" + id);
}
function IniCaseData() {
    InitData(pageNo - 1);
}

function RemoveApply() {
    var id = $("#hidfrid").val();
    var parameter = {
        requestUri: "/api/successfulcase/"+id
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/delete",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert('删除成功');
            $("." + id).remove();
            CloseConfirm();

        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}