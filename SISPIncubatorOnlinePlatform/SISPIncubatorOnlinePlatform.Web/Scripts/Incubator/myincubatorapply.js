
$(function () {
    if (!CheckUserLogin()) return;

    GetMyIncubatorApply();

    InitEventByKeyUp();
});

function InitEventByKeyUp() {
    $("#divSearchCondition").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            Search();
        }
    });
}
//获取我的办公室租赁申请
function GetMyIncubatorApply() {
    ShowLoading();
    $("#divNodata").hide();
    var ps = 10;

    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        IncubatorTypeRole: "my",
        KeyWord: $.trim($("#divSearchCondition").val())
    }

    var parameter = {
        requestUri: "/api/incubatorapplies",
        requestParameters: searchObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;

               GetIncubatorApplyHtml(results);

               totalRecords = data.totalCount;

               pageinit(data.totalCount, ps, "divpager");

               if (totalRecords == 0) {
                   $("#divNodata").show();
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//获取我的孵化器申请html
function GetIncubatorApplyHtml(data) {
    $("#tbBodyContent").empty();
    var html = "";
    for (i = 0; i < data.length; i++) {
        html += "<tr><td><div class=\"over-txt-p\"><div title='" + data[i].projectName + "' class=\"over-txt\">" + data[i].projectName + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td><div class=\"over-txt-p\"><div title='" + data[i].projectOwner + "' class=\"over-txt\">" + data[i].projectOwner + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td><div class=\"over-txt-p\"><div title='" + data[i].incubatorName + "' class=\"over-txt\">" + data[i].incubatorName + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td>" + data[i].appDate + "</td>";
        var statusHtm = "";
        if (data[i].applyStatus == "2" || data[i].applyStatus == "1") {
            statusHtm = "<p class=\"yellow-color\">" + data[i].applyStatusDes + "</p>";
        } else if (data[i].applyStatus == "4") {
            statusHtm = "<p class=\"green-color\">审核通过</p>";
        } else if (data[i].applyStatus == "3" || data[i].applyStatus == "5") {
            statusHtm = "<p class=\"red-color\">审核驳回</p>";
        } else {
            statusHtm = "<p >" + data[i].applyStatusDes + "</p>";
        }
        html += " <td>" + statusHtm + "</td>";
        html += " <td>";

        if (data[i].applyStatus == "3" || data[i].applyStatus == "5") {
            html += "  <a class=\"operate-btn edit-btn\" title='修改' onclick=\"ModifyApply('" + data[i].applyID + "')\" href=\"#\"></a>";
            html += "  <a class=\"operate-btn back-btn\" onclick=\"OpenConfirm('" + data[i].applyID + "');\" title='撤销' href=\"#\"></a>";
        }
        html += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].applyID + "');\"></a>";
        if (data[i].agreementTemplate != null) {
            html += "  <a class='operate-btn down-btn' title='下载模版' href=\"" + data[i].agreementTemplate.fileUrl + "\"></a>";
        }
        html += "<input id=\"hidItemApplyId\" value='" + data[i].applyID + "' class=\"hidItemApplyId\" type=\"hidden\" /></td></tr>";
    }
    if ($.trim(html) != "") {
        $("#tbBodyContent").html(html);
    }
}
//查看详情
function OpenDetail(id) {
    window.open("incubatorapplydetail.html?id=" + id + "&src=mylist");
}
//发布租赁申请
function OpenApply() {
    window.open("incubatorapply.html");
}
//修改发布申请
function ModifyApply(id) {
    window.open("incubatorapply.html?rid=" + id);
}
//打开撤销确认对话框
function OpenConfirm(id) {
    $(".divConfirm").show();
    $("#hidApplyId").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidApplyId").val("");
}
//执行撤销功能
function SetRevoke() {

    var id = $("#hidApplyId").val();

    ShowLoading();

    var officeObj = {
        ApplyID: id
    };
    var formObj = {
        "IncubatorApply": officeObj
    };

    var parameter = {
        requestUri: "/api/incubatorapply/revoke",
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
               //$("#tbBodyContent>tr").each(function() {
               //    var applyid = $(this).find(".hidItemApplyId").val();
               //    if (applyid == id) {
               //        $(this).find(".cancel-btn").hide();
               //        $(this).find(".edit-btn").hide();
               //    }
               //});
               CloseConfirm();
               HideLoading();
               GetMyIncubatorApply();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//查询
function Search() {
    pageNo = 1;
    GetMyIncubatorApply();
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetMyIncubatorApply();
}