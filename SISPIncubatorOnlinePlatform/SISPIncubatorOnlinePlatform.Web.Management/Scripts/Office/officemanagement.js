
$(function () {
    //if(!CheckUserLogin())return ;
    CheckUserLogin();
    InitData();
    GetOfficeManageList();
});

function InitData() {
    $(".selectStatus").select2({
        minimumResultsForSearch: Infinity
    });

    $('.selectStatus').change(function () {
        pageNo = 1;
        GetOfficeManageList();
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            $(".search-btn").click();
        }
    });
}

//获取我的办公室租赁申请
function GetOfficeManageList() {
    $("#divNodata").hide();
    var pz = 10;
    var searchObj = {
        PageSize: pz,
        PageNumber: pageNo,
        KeyWord: $.trim($("#txtkeyword").val()),
        OperModel: "admin",
        Status: $(".selectStatus").val()
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
    var html = "";
    $("#tbBodyContent").empty();
    for (i = 0; i < data.length; i++) {
        html += "<tr><td><input class=\"base-checkbox chkItem\" value='" + data[i].applyID + "' onclick='ChkItem()' type=\"checkbox\"></td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].appUserName + "' class=\"over-txt\">" + data[i].appUserName + "</div><div class=\"run-over\">...</div></div></td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].projectOwner + "' class=\"over-txt\">" + data[i].projectOwner + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td><div class=\"over-txt-p\"><div title='" + data[i].companyName + "' class=\"over-txt\">" + data[i].companyName + "</div><div class=\"run-over\">...</div></div></td>";
        html += " <td>" + data[i].createdDate + "</td>";
        var statusHtm = "";

        //statusHtm = "<p >" + data[i].applyStatusDes + "</p>";

        if (data[i].applyStatus == "1") {
            statusHtm = "<p class=\"yellow-color\">" + data[i].applyStatusDes + "</p>";
        } else if (data[i].applyStatus == "2") {
            statusHtm = "<p class=\"green-color\">" + data[i].applyStatusDes + "</p>";
        } else if (data[i].applyStatus == "3") {
            statusHtm = "<p class=\"red-color\">" + data[i].applyStatusDes + "</p>";
        } else {
            statusHtm = "<p >" + data[i].applyStatusDes + "</p>";
        }

        html += " <td>" + statusHtm + "</td>";
        html += " <td>";

        html += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn edit-btn\" title='修改申请' onclick=\"ModifyApply('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].applyID + "');\"></a>";
        html += "  <a class=\"operate-btn remove-btn\" title='删除' onclick=\"DeleteApplyById('" + data[i].applyID + "');\"></a>";
        html += "<input id=\"hidItemApplyId\" value='" + data[i].applyID + "' class=\"hidItemApplyId\" type=\"hidden\" /></td></tr>";
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
    window.open("/Office/officesettledaapplydetail.html?id=" + id);
}
//发布租赁申请
function OpenApply() {
    window.open("/Office/officesettledaapply.html");
}
//修改发布申请
function ModifyApply(id) {
    window.open("/Office/officeapply.html?id=" + id);
}
//查询
function Search() {
    pageNo = 1;
    GetOfficeManageList();
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetOfficeManageList();
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
//执行删除操作
function DeleteApply() {

    var searchObj = {
        ApplyIds: $("#hidApplyIds").val()
    }

    var parameter = {
        requestUri: "/api/officeapply/dm",
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
                   GetOfficeManageList();
               }, 2000);

           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//删除选中项
function DeleteApplySelect() {
    if ($(".chkItem:checked").length <= 0) {
        $(this).alert('请选择需要删除的项目！');
        return;
    }
    var allIds = "";
    $(".chkItem:checked").each(function () {
        var id = $(this).val();
        allIds = allIds + "|" + id;
    });
    $("#hidApplyIds").val(allIds);
    OpenConfirm();
}
//删除单项
function DeleteApplyById(id) {
    $("#hidApplyIds").val(id);
    OpenConfirm();
}