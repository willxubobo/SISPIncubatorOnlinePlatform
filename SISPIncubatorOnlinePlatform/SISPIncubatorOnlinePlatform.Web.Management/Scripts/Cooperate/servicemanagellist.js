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
    $("#divService").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterservicefunction").val() + "()");
        }
    });
}
function InitData(page) {
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        SearchString: $("#searchCooperateValue").val(),
        Status: $("#statusSelectIpt").find("option:selected").val()
    }
    var parameter = {
        requestUri: "/api/servicepublish/all",
        "requestParameters": searchObj
    }
    ShowLoading();
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
            }
            else {
                $("#activityBody").empty();
                $("#divNodata").show();
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

        var serviceID = data[i].serviceID;
        var companyName = data[i].companyName;
        var category = data[i].category;
        var created = data[i].created;
        var phoneNumber = data[i].phoneNumber;
        var status = data[i].status;
        var createDate = data[i].created.substr(0, 10);
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
        html += " <tr class=" + serviceID + "><td>" + createDate + "</td>";
        html += "<td>" + companyName + "</td><td>" + category + "</td><td>" + phoneNumber + "</td>";
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

        html += "<td><a class='operate-btn edit-btn' onclick=\"editservice('" + serviceID + "')\"></a><a class='operate-btn detail-btn' onclick=\"OpenDetail('" + serviceID + "')\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + serviceID + "')\" ></a><a class='operate-btn remove-btn' onclick=\"OpenConfirm('" + serviceID + "')\"></a></td></tr>"
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
function editservice(id) {
    window.open("servicepublish.html?id=" + id);
}
//详情
function OpenDetail(id) {
    window.open("servicemanagedetail.html?id=" + id);
}
function IniServiceData() {
    InitData(pageNo - 1);
}

function RemoveApply() {
    var id = $("#hidfrid").val();
    var formObj = {
        Id: id
    };
    ShowLoading();
    var parameter = {
        requestUri: "/api/servicepublish/remove",
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
            HideLoading();
        }
    });
}
function SearchCooperateData() {
    $("#activityBody").empty();
    $("#searchCooperateValue").val($.trim($("#txtkeyword").val()));
    pagePagination(1);
}

