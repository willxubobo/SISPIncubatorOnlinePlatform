$(function () {
    pagePagination(1);
    InitEventByKeyUp();
})
function pagePagination(p) {
    pageNo = p;
    InitData(pageNo - 1);
}
function InitData(page) {
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        searchString: $("#searchActivityValue").val()
    }
    var parameter = {
        requestUri: "/api/activitysignups/stats",
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
function InitEventByKeyUp() {
    $("#divActivity").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enteractivityfunction").val() + "()");
        }
    });
}
function GetHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {

        var activityID = data[i].activityID;
        var topic = data[i].topic;
        var statrTime = data[i].startTime.substr(0, 10);
        var endTime = data[i].endTime.substr(0, 10);
        var peopleNumber = data[i].peopleNumber;
        if (GetLength(data[i].topic) > 20) {
            var topic = cutstr(data[i].topic, 20)
        }
        else {
            var topic = data[i].topic;
        }

        html += "<tr><td>" + topic + "</td><td>" + statrTime + "~" + endTime + "</td><td><a class='yellow-color' style='cursor: pointer' onclick=\"OpenDetail('" + activityID + "');\">" + peopleNumber + "</a></td>";

        $("#activityBody").empty();
        $("#activityBody").append(html);
    }
}
//详情
function OpenDetail(id) {
    window.open("signupinformation.html?id=" + id);
}

function SearchActivityData() {
    $("#activityBody").empty();
    $("#searchActivityValue").val($.trim($("#txtkeyword").val()));
    pagePagination(1);
}