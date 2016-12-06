
$(function () {
    if (!CheckUserLogin()) return;

    GetMyOfficeSettleApply();
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
function GetMyOfficeSettleApply() {
    ShowLoading();
    $("#divNodata").hide();
    var pz = 10;
    var searchObj = {
        PageSize: pz,
        PageNumber: pageNo,
        KeyWord: $.trim($("#divSearchCondition").val()),
        OperModel: "my"
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/officeapplies",
        requestParameters: searchObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               if (results) {
                   GetHtml(results);

                   totalRecords = data.totalCount;
                   pageinit(data.totalCount, pz, "divPager");

                   if (totalRecords == 0) {
                       $("#divNodata").show();
                   } else {
                       $("#divNodata").hide();
                   }
               }
               else {
                   if (totalRecords == 0) {
                       $("#divNodata").show();
                   } else {
                       $("#divNodata").hide();
                   }
               }
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}
//获取我的办公室租赁html
function GetHtml(data) {
    $("#tbBodyContent").empty();
    var html = "";
    for (i = 0; i < data.length; i++) {
        html += "<tr><td><div class=\"over-txt-p\"><div title='" + data[i].projectOwner + "' class=\"over-txt\">" + data[i].projectOwner + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td><div class=\"over-txt-p\"><div title='" + data[i].companyName + "' class=\"over-txt\">" + data[i].companyName + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td>" + data[i].createdDate + "</td>";
        var statusHtm = "";
        if (data[i].applyStatusDes == "待审核") {
            statusHtm = "<p class=\"yellow-color\">待审核</p>";
        } else if (data[i].applyStatusDes == "审核通过") {
            statusHtm = "<p class=\"green-color\">审核通过</p>";
        } else if (data[i].applyStatusDes == "审批驳回") {
            statusHtm = "<p class=\"red-color\">审批驳回</p>";
        } else {
            statusHtm = "<p >" + data[i].applyStatusDes + "</p>";
        }
        html += " <td>" + statusHtm + "</td>";
        html += " <td>";

        if (data[i].applyStatusDes == "审批驳回") {
            html += "  <a class=\"operate-btn edit-btn\" title='修改' onclick=\"ModifyApply('" + data[i].applyID + "')\" href=\"#\"></a>";
            html += "  <a class=\"operate-btn back-btn\" onclick=\"OpenConfirm('" + data[i].applyID + "');\" title='撤销' href=\"#\"></a>";
        }
        html += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].applyID + "');\"></a>";
        html += "<input id=\"hidItemApplyId\" value='" + data[i].applyID + "' class=\"hidItemApplyId\" type=\"hidden\" /></td></tr>";
    }
    if ($.trim(html) != "") {
        $("#tbBodyContent").html(html);
    }
}
//查看详情
function OpenDetail(id) {
    window.open("officesettledaapplydetail.html?id=" + id);
}
//发布租赁申请
function OpenApply() {
    window.open("officesettledaapply.html");
}
//修改发布申请
function ModifyApply(id) {
    window.open("officesettledaapply.html?id="+id);
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
        "OfficeApply": officeObj
    };

    var parameter = {
        requestUri: "/api/officeapply/revoke",
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
               GetMyOfficeSettleApply();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//查询
function Search() {
    pageNo = 1;
    GetMyOfficeSettleApply();
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetMyOfficeSettleApply();
}