$(function () {
    pagePagination(1);
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
    $(".selectIpt").on("select2:select", function (e) {
        pagePagination(1);
    });
    InitEventByKeyUp();
})
function pagePagination(p) {
    pageNo = p;
    InitData(pageNo - 1);
}
function InitEventByKeyUp() {
    $("#divActivity").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enteractivityfunction").val() + "()");
        }
    });
}
function InitData(page) {
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        Status:$("#statusSelectIpt").find("option:selected").val(),
        searchString: $("#searchActivityValue").val()
    }
    var parameter = {
        requestUri: "/api/activitycalendar/all",
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
function GetHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {

        var activityID = data[i].activityID;
        var companyName = data[i].companyName;
        var topic = data[i].topic;
        var statrTime = data[i].startTime.substr(0, 10);
        var endTime = data[i].endTime.substr(0, 10);
        var created = data[i].created;
        var category = data[i].category;
        var status = data[i].status;
        var createDate = data[i].created.substr(0, 10);


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
        html += " <tr class='" + id +" tip' ><td>" + createDate + "</td>";
        if (GetLength(data[i].topic) > 20) {
            var newtopic = cutstr(data[i].topic, 20);
            html += "<td title='" + data[i].topic + "'>" + newtopic + "</td><td>" + statrTime + "~" + endTime + "</td>";
        }
        else {
            var topic = data[i].topic;
            html += "<td>" + topic + "</td><td>" + statrTime + "~" + endTime + "</td>";
        }
        if (status == "待审核") {
            html += "<td><p class='yellow-color'>" + status + "</p></td>";
        }
        if (status == "审核通过") {
            html += "<td><p class='green-color'>" + status + "</p></td>";
        }
        if (status == "审核驳回") {
            html += "<td><p class='red-color'>" + status + "</p></td>";
        }
        if (status == "撤销") {
            html += "<td><p class='gray-color'>" + status + "</p></td>";
        }
        if (category == "0") {
            html += "<td><a class='operate-btn edit-btn' onclick=\"editactivity('" + id + "')\"></a>";
        } else {
            html += "<td><a class='operate-btn edit-btn' onclick=\"editincubatoractivity('" + id + "')\"></a>";
        }
        html += "<a class='operate-btn detail-btn' onclick=\"OpenDetail('" + id + "', '" + category + "')\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a><a class='operate-btn remove-btn' onclick=\"OpenConfirm('" + id + "', '" + category + "');\"></a></td></tr>"
    }
    $("#activityBody").empty();
    $("#activityBody").append(html);
}
//打开撤销确认对话框
function OpenConfirm(id, category) {
    $(".divConfirm").show();
    $("#hidfrid").val(id);
    $("#hidcategory").val(category);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidfrid").val("");
    $("#hidcategory").val("");
}
//审批
function editactivity(id) {
    window.open("activitypublishapply.html?id=" + id);
}
function editincubatoractivity(id) {
    window.open("incubatoractivityapply.html?id=" + id);
}
//详情
function OpenDetail(id, category) {
    window.open("activitymanagedetail.html?id=" + id + "&category=" + category);
}

function InitGetActivityData() {
    InitData(pageNo - 1);
}
function SearchActivityData() {
    $("#activityBody").empty();
    $("#searchActivityValue").val($.trim($("#txtkeyword").val()));
    pagePagination(1);
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

function RemoveApply() {
    var id = $("#hidfrid").val();
    var category = $("#hidcategory").val();
    var formObj = {
        Id: id,
        Category: category
    };
    ShowLoading();
    var parameter = {
        requestUri: "/api/activity/remove",
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
            $(this).alert("删除成功");

            CloseConfirm();
            HideLoading();
            pagePagination(1);
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}