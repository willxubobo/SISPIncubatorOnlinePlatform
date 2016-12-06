$(function () {
    pagePagination(1);
})
function pagePagination(p) {
    pageNo = p;
    InitData(pageNo - 1);
}
function InitData(page) {
    var activityId = getUrlParam("id");
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        ActivityId: activityId
    }
    var parameter = {
        requestUri: "/api/activitysignups/information",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    ShowLoading();
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result.results.length > 0) {
                GetHtml(result.results);
            }
            else {
                $("#activityBody").empty();
            }
            pageinit(result.totalCount, "10", "div_pager", "pagePagination");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
function GetHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var signUpName = data[i].signUpName;
        var phoneNumber = data[i].phoneNumber;
        var workingCompany = data[i].workingCompany;
        html += "<tr><td>" + signUpName + "</td><td>" + workingCompany + "</td><td>" + phoneNumber + "</td>";

        $("#activityBody").empty();
        $("#activityBody").append(html);
    }
}
//导出excel
function ExportExcel() {
    var activityId = getUrlParam("id");
    var searchObj = {
        ActivityId: activityId
    }
    var parameter = {
        requestUri: "/api/activitysignups/exportreport",
        requestParameters: searchObj
    }

    var jsonData = JSON.stringify(parameter);
    ShowLoading();
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               if (data.fileUrl != null && data.fileUrl != "") {

                   var iframe = document.createElement("iframe");

                   iframe.src = data.fileUrl;
                   // This makes the IFRAME invisible to the user.
                   iframe.style.display = "none";
                   // Add the IFRAME to the page.  This will trigger
                   //   a request to GenerateFile now.
                   document.body.appendChild(iframe);
               }
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}