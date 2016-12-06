$(function () {
    if (!CheckUserLogin()) {
        return false;
    }
    InitMyActivityData();
})
function InitMyActivityData() {
    pagePagination(1);
    pageDemandPagination(1);
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
    $(".selectIpt").on("select2:select", function (e) {
        pagePagination(1);
    });
}
function pagePagination(p) {
    pageNo = p;
    InitActivityData($(".selectIpt").val(), pageNo - 1);
}
function pageDemandPagination(p) {
    pageNo = p;
    InitSignUpData(pageNo - 1);
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

function InitSignUpData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page
    }
    var parameter = {
        requestUri: "/api/myactivity",
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
            if (result.results && result.results.length > 0) {
                $("#applyNoData").hide();
                GetActivityHtml(result.results);
            } else {
                $("#applyNoData").show();
            }
            pageinit(result.totalCount, "10", "activity_pager", "pageDemandPagination");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function InitActivityData(selectValue,page) {
    if (selectValue == "举办孵化器活动申请") {
        InitIncubatorActivityData(page);
    }
    else {
        InitActivityPublishData(page);
    }
}
function InitActivityPublishData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page
    }
    var parameter = {
        requestUri: "/api/myactivitypublishapplies",
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
            if (result.results && result.results.length > 0) {
                $("#activityNoData").hide();
                GetHtml(result.results,0);
            }
            else {
                $("#activityNoData").show();
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
function InitIncubatorActivityData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page
    }
    var parameter = {
        requestUri: "/api/myincubatoractivityapplies",
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
            $("#activityNoData").hide();
            if (result.results && result.results.length > 0) {
                GetHtml(result.results,1);
            } else {
                $("#activityNoData").show();
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
function GetHtml(data,category) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var createDate = data[i].created.substr(0, 10);
        var statrTime = data[i].startTime.substr(0, 10);
        var endTime = data[i].endTime.substr(0, 10);
        var timeBucket = data[i].timeBucket;
        var id = data[i].activityID;
        var status = data[i].status;
        if (status == 1) {
            status = "待审核";
        }
        if (status == 2) {
            status = "审核通过";
        }
        if (status == 3) {
            status = "审核驳回";
        }
        if (status == 4) {
            status = "撤销";
        }
        html += " <tr class=" + id + "><td>" + createDate + "</td>";
        if (GetLength(data[i].topic) > 20) {
            var newtopic = cutstr(data[i].topic, 20);
            html += "<td title='" + data[i].topic + "'>" + newtopic + "</td><td>" + statrTime + "~" + endTime + "</td><td>" + timeBucket + "</td>";
        }
        else {
            var topic = data[i].topic;
            html += "<td>" + topic + "</td><td>" + statrTime + "~" + endTime + "</td><td>" + timeBucket + "</td>";
        }
        if (status == "待审核") {
            html += "<td><p class='yellow-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showinfo('" + id + "','" + category + "');\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
        if (status == "审核通过") {
            html += "<td><p class='green-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showinfo('" + id + "','" + category + "');\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
        if (status == "审核驳回") {
            if (category == 0) {
                html += "<td><p class='red-color'>" + status + "</p></td><td><a class='operate-btn edit-btn' onclick=\"editactivityinfo('" + id + "');\"></a><a class='operate-btn back-btn' onclick=\"BackActivityPublish('" + id + "')\" ></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a><a class='operate-btn detail-btn' onclick=\"showinfo('" + id + "','" + category + "');\"></a></td></tr>";
            } else {
                html += "<td><p class='red-color'>" + status + "</p></td><td><a class='operate-btn edit-btn' onclick=\"editincubatorinfo('" + id + "');\"></a><a class='operate-btn back-btn' onclick=\"BackIncubatorActivityApply('" + id + "')\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a><a class='operate-btn detail-btn' onclick=\"showinfo('" + id + "','" + category + "');\"></a></td></tr>";
            }
        }
        if (status == "撤销") {
            html += "<td><p class='gray-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showinfo('" + id + "','" + category + "');\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
    }
    $("#activityBody").empty();
    $("#activityBody").append(html);
}
function showinfo(id, category) {
    window.open("activitydetail.html?id=" + id + "&category=" + category+ "&type=1");
}

function editactivityinfo(id) {
    window.open("activitypublishapply.html?id=" + id);
}

function editincubatorinfo(id, category) {
    window.open("incubatoractivityapply.html?id=" + id);
}

function GetActivityHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var signUpID = data[i].signUpID;
        var id = data[i].activityId;
        var topic = data[i].topic;
        if (GetLength(data[i].topic) > 20) {
            var topic = cutstr(data[i].topic, 20)
        }
        else {
            var topic = data[i].topic;
        }
        var statrTime = data[i].startTime.substr(0, 10);
        var endTime = data[i].endTime.substr(0, 10);
        var category = data[i].category;
        html += "<tr class=" + signUpID + "><td>" + statrTime + "~" + endTime + "</td><td>" + topic + "</td>";
        html += "<td><a class='operate-btn detail-btn' onclick=\"showinfo('" + id + "','" + category + "');\"></a><a class='operate-btn remove-btn' onclick=\"OpenConfirm('" + signUpID + "')\"></a></td></tr>";
    }
    $("#myActivityBody").empty();
    $("#myActivityBody").append(html);
}
var GetLength = function (str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4  
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (str_length < len) {
        return str;
    }
}

function DelMyActivity() {
    var id = $("#hidfrid").val();
    var parameter = {
        requestUri: "/api/activitysignup/" + id,
        "requestParameters": {
        }
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/delete",
        data: parameterJson,
        success: function (result) {
            $(this).alert("删除成功");
            $("." + id).remove();
            CloseConfirm();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function BackActivityPublish(id) {

    var activityObj = {
        ActivityID: id
    };
    var formObj = {
        "ServicePublish": activityObj
    };

    var parameter = {
        requestUri: "/api/activitypublishapply/revoke",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            $(this).alert("撤销成功");
            $("." + id).find(".red-color").each(function () {
                var tdobj = $(this).parent();
                tdobj.empty();
                tdobj.append("<p class='gray-color'>撤销</p>");
            });
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
    
}

function BackIncubatorActivityApply(id) {

    var activityObj = {
        ActivityID: id
    };
    var formObj = {
        "IncubatorActivityApply": activityObj
    };

    var parameter = {
        requestUri: "/api/incubatoractivityapply/revoke",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            $(this).alert("撤销成功");
            $("." + id).find(".red-color").each(function () {
                var tdobj = $(this).parent();
                tdobj.empty();
                tdobj.append("<p class='gray-color'>撤销</p>");
            });
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });

}