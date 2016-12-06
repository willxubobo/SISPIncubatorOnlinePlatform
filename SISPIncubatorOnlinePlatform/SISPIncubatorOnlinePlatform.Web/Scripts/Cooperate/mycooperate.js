$(function () {
    if (!CheckUserLogin()) {
        return false;
    }
    InitMyCooperateData();
    InitEventByKeyUp();
});
function InitMyCooperateData() {
    pagePagination(1);
    pageDemandPagination(1);
}
function pagePagination(p) {
    pageNo = p;
    InitServiceData(p - 1);
}
function pageDemandPagination(p) {
    demandPageNo = p;
    InitDemandData(demandPageNo - 1);
}
function InitEventByKeyUp() {
    $("#divService").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterservicefunction").val() + "()");
        }
    });
    $("#divDemand").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterdemandfunction").val() + "()");
        }
    });
}
function InitDemandData(demandpage) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: demandpage,
        searchString: $("#searchDemandValue").val()
    }
    var parameter = {
        requestUri: "/api/mydemandpublishs",
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
            $("#demandNoData").hide();
            if (result.results && result.results.length > 0) {
                GetDemandHtml(result.results);
            }
            else {
                $("#demandNoData").show();
            }
            pageinit(result.totalCount, "10", "demand_pager", "pageDemandPagination");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function InitServiceData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        searchString: $("#searchServiceValue").val()
    }
    var parameter = {
        requestUri: "/api/myservicepublishs",
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
            $("#serviceNoData").hide();
            if (result.results && result.results.length > 0) {
                GetServiceHtml(result.results);
            }
            else {
                $("#serviceNoData").show();
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
function GetServiceHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var companyName = data[i].companyName;
        var industry = data[i].industryName;
        var category = data[i].category;
       
        var id = data[i].serviceID;
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
        if (GetLength(companyName) > 20) {
            html += "<tr class=" + id + "><td title='" + companyName + "'>" + cutstr(companyName, 20) + "</td>";
        }
        else {
            html += "<tr class=" + id + "><td>" +companyName + "</td>";
        }
        if (GetLength(industry) > 12) {
            html += "<td title='" + industry + "'>" + cutstr(industry, 12) + "</td><td>" + category + "</td>";
        }
        else {
            html += "<td>" + industry + "</td><td>" + category + "</td>";
        }
        
        if (status == "待审核") {
            html += "<td><p class='yellow-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showserviceinfo('" + id + "');\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
        if (status == "审核通过") {
            html += "<td><p class='green-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showserviceinfo('" + id + "');\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
        if (status == "审核驳回") {
            html += "<td><p class='red-color'>" + status + "</p></td><td><a class='operate-btn edit-btn' onclick=\"editserviceinfo('" + id + "');\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a><a class='operate-btn back-btn' onclick=\"BackService('" + id + "')\" ></a><a class='operate-btn detail-btn' onclick=\"showserviceinfo('" + id + "');\"></a></td></tr>";
        }
        if (status == "撤销") {
            html += "<td><p class='gray-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showserviceinfo('" + id + "');\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
    }
    $("#serviceBody").empty();
    $("#serviceBody").append(html);
}
function showserviceinfo(id) {
    window.open("servicedetail.html?id=" + id);
}

function editserviceinfo(id) {
    window.open("servicepublish.html?id=" + id);
}

function GetDemandHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var companyName = data[i].companyName;
        var foundedTime = data[i].foundedTime.substr(0, 10)
        var members = data[i].members;
        var id = data[i].demandID;
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
        if (GetLength(companyName) > 20) {
            html += "<tr class=" + id + "><td title='" + companyName + "'>" + cutstr(companyName, 20) + "</td><td>" + foundedTime + "</td><td>" + members + "</td>";
        }
        else {
            html += "<tr class=" + id + "><td>" + companyName + "</td><td>" + foundedTime + "</td><td>" + members + "</td>";
        }
        
        if (status == "待审核") {
            html += "<td><p class='yellow-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showdemandinfo('" + id + "');\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
        if (status == "审核通过") {
            html += "<td><p class='green-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showdemandinfo('" + id + "');\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
        if (status == "审核驳回") {
            html += "<td><p class='red-color'>" + status + "</p></td><td><a class='operate-btn edit-btn' onclick=\"editdemandinfo('" + id + "');\"></a><a class='operate-btn  search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a><a class='operate-btn back-btn' onclick=\"BackDemand('" + id + "')\" ></a><a class='operate-btn detail-btn' onclick=\"showdemandinfo('" + id + "');\"></a></td></tr>";
        }
        if (status == "撤销") {
            html += "<td><p class='gray-color'>" + status + "</p></td><td><a class='operate-btn detail-btn' onclick=\"showdemandinfo('" + id + "');\"></a><a class='operate-btn search1-btn' onclick=\"$(this).showapproveprogress('" + id + "')\" ></a></td></tr>";
        }
    }
    $("#demandBody").empty();
    $("#demandBody").append(html);
}

function showdemandinfo(id) {
    window.open("demanddetail.html?id=" + id);
}

function editdemandinfo(id) {
    window.open("demandpublish.html?id=" + id);
}

function SearchServiceData()
{
    $("#serviceBody").empty();
    $("#searchServiceValue").val($.trim($("#txtServiceCondition").val()));
    pagePagination(1);
}
function SearchDemandData() {
    $("#demandBody").empty();
    $("#searchDemandValue").val($.trim($("#txtDemandCondition").val()));
    pageDemandPagination(1);
}

function BackDemand(id) {

    var demandObj = {
        DemandID: id
    };
    var formObj = {
        "DemandPublish": demandObj
    };

    var parameter = {
        requestUri: "/api/demandpublish/revoke",
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

function BackService(id) {

    var serviceObj = {
        ServiceID: id
    };
    var formObj = {
        "IncubatorActivityApply": serviceObj
    };

    var parameter = {
        requestUri: "/api/servicepublish/revoke",
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