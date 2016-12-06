
$(function () {
    //if (!CheckUserLogin()) return;
    CheckUserLogin();
    InitData();
    GetIncubatorApplyList();

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            $(".search-btn").click();
        }
    });
});
function InitData() {
    $(".selectStatus").select2({
        minimumResultsForSearch: Infinity
    });

    $('.selectStatus').change(function () {
        pageNo = 1;
        GetIncubatorApplyList();
    });
}
//获取我的孵化器租赁申请
function GetIncubatorApplyList() {

    $("#divNodata").hide();

    var ps = 10;

    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        IncubatorTypeRole: "adminmanagment",
        KeyWord: $.trim($("#txtkeyword").val()),
        Status: $(".selectStatus").val()
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
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//获取我的孵化器申请html
function GetIncubatorApplyHtml(data) {
    var html = "";
    $("#tbBodyContent").empty();

    for (i = 0; i < data.length; i++) {
        html += "<tr><td><input class=\"base-checkbox chkItem\" value='" + data[i].applyID + "' onclick='ChkItem()' type=\"checkbox\"></td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].appUserName + "' class=\"over-txt\">" + data[i].appUserName + "</div><div class=\"run-over\">...</div></div></td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].projectName + "' class=\"over-txt\">" + data[i].projectName + "</div><div class=\"run-over\">...</div></div></td>";
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
       
        html += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn edit-btn\" title='修改申请' onclick=\"ModifyIncubatorApply('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].applyID + "');\"></a>";
        html += "  <a class=\"operate-btn remove-btn\" title='删除' onclick=\"DeleteIncubatorApplyById('" + data[i].applyID + "');\"></a>";
        html += "<input id=\"hidItemApplyId\" value='" + data[i].applyID + "' class=\"hidItemApplyId\" type=\"hidden\" /></td></tr>";

        $("#hidUserType").val(data[i].userType);
    }
    if ($.trim(html) != "") {
        $("#tbBodyContent").html(html);
    }
}
//全选
function ChkAll(obj) {
    if (obj.checked) {
        $(".chkItem").prop("checked", true);
    } else {
        $(".chkItem").prop("checked", false);
    }
}
//单项选择
function ChkItem() {
    if ($(".chkItem:checked").length == $(".chkItem").length) {
        $(".chkAll").prop("checked", true);
    } else {
        $(".chkAll").prop("checked", false);
    }
}
//查看详情
function OpenDetail(id) {
    window.open("/Incubator/incubatorapplydetail.html?id=" + id);
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetIncubatorApplyList();
}
//修改单据
function ModifyIncubatorApply(id) {
    window.open("/Incubator/incubatorapply.html?rid=" + id);
}
//删除单项
function DeleteIncubatorApplyById(id) {
    $("#hidUserOper").val("item");
    $("#hidApplyIds").val(id);
    OpenConfirm();
}
//删除多个
function DeleteIncubatorApplySelect() {

    if ($(".chkItem:checked").length <= 0) {
        $(this).alert('请选择需要删除的项目！');
        return;
    }

    $("#hidUserOper").val("all");
    var allIds = "";
    $(".chkItem:checked").each(function() {
        var id = $(this).val();
        allIds = allIds + "|" + id;
    });
    $("#hidApplyIds").val(allIds);
    OpenConfirm();
}
//执行删除操作
function DeleteIncubatorApply() {

    var searchObj = {
        ApplyIds: $("#hidApplyIds").val()
    }

    var parameter = {
        requestUri: "/api/incubatorapply/dm",
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
               CloseConfirm();
               $(this).alert('删除成功');
               setTimeout(function () {
                   GetIncubatorApplyList();
               }, 2000);
              
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//打开撤销确认对话框
function OpenConfirm() {
    $(".divConfirm").show();
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidApplyIds").val("");
}
//查询
function SearchKey() {
    pageNo = 1;
    GetIncubatorApplyList();
}