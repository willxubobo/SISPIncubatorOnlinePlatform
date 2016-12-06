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
        searchString: ""
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
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result.results.length > 0) {
                GetHtml(result.results);
            } else {
                $("#tabInvestor").empty();
            }
            pageinit(result.totalCount, "10", "div_pager", "pagePagination");
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function GetHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {

        var caseID = data[i].caseID;
        var title = data[i].title;
        var category = data[i].category;
        var content = data[i].content;
        if (GetLength(data[i].content) > 20) {
            content = cutstr(data[i].content, 20)
        }
        html += "<tr>";
        html += "<td class=\"tdImg\">";
        html += "  <a class='caseTitleA' onclick=\"ShowCaseInfo('" + caseID + "')\" ><img src=\"" + data[i].picture + "\"></a>";
        html += "</td>";
        html += "	<td colspan=\"4\"><span class='casecategory'>[" + category + "]</span><a class='caseTitleA' onclick=\"ShowCaseInfo('" + caseID + "')\" ><span class='caseTitle'>" + title + "</span></a><br/><a class='caseContent' onclick=\"ShowCaseInfo('" + caseID + "')\"><span class=\"casecontent\">" + content + "</span></a></td></tr>";
    }
    $("#tabInvestor").empty();
    $("#tabInvestor").append(html);
}

function ShowCaseInfo(id) {
    window.open("../SuccessCase/successfulcasedetail.html?id=" + id);
}