$(function () {
    pagePagination(1);
    $(".selectIpt").select2({
        minimumResultsForSearch: Infinity
    });
    $(".selectIpt").on("select2:select", function (e) {
        pagePagination(1);
    });
})
function pagePagination(p) {
    pageNo = p;
    InitData(pageNo - 1);
    InitEventByKeyUp();
}
function InitEventByKeyUp() {
    $("#divDemand").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterdemandfunction").val() + "()");
        }
    });
}
function InitData(page) {
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        Status: $("#statusSelectIpt").find("option:selected").val(),
        searchString: $("#searchCooperateValue").val()
    }
    var parameter = {
        requestUri: "/api/demandpublishs/all",
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
            } else {
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

        var demandID = data[i].demandID;
        var companyName = data[i].companyName;
        var category = data[i].category;
        var contacts = data[i].contacts;
        var created = data[i].created;
        var members = data[i].members;
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
        html += " <tr class=" + demandID + "><td>" + createDate + "</td>";
        html += "<td>" + companyName + "</td><td>" + category + "</td><td>" + contacts + "</td><td>" + members + "</td>";
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
        html += "<td><a class='operate-btn edit-btn' onclick=\"editdemand('" + demandID + "')\"></a><a class='operate-btn detail-btn' onclick=\"OpenDetail('" + demandID + "')\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + demandID + "')\" ></a><a class='operate-btn remove-btn' onclick=\"OpenConfirm('" + demandID + "')\"></a></td></tr>"
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
function editdemand(id) {
    window.open("demandpublish.html?id=" + id);
}
//详情
function OpenDetail(id) {
    window.open("demandmanagedetail.html?id=" + id);
}
function IniDemandData() {
    InitData(pageNo - 1);
}
function RemoveApply() {
    var id = $("#hidfrid").val();
    var formObj = {
        Id: id
    };

    var parameter = {
        requestUri: "/api/demandpublishs/remove",
        requestParameters: formObj
    }
    ShowLoading();
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

