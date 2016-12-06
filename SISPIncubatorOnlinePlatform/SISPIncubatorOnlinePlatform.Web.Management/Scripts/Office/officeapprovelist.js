
$(function () {
    //if(!CheckUserLogin())return ;
    CheckUserLogin();
    InitData();
    GetMyOfficeSettleApproveList();
});
function InitData() {
    $(".selectStatus").select2({
        minimumResultsForSearch: Infinity
    });

    $('.selectStatus').change(function () {
        pageNo = 1;
        GetMyOfficeSettleApproveList();
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            $(".search-btn").click();
        }
    });
}
//获取我的办公室租赁申请
function GetMyOfficeSettleApproveList() {

    $("#divNodata").hide();
    var pz = 10;
    var searchObj = {
        PageSize: pz,
        PageNumber: pageNo,
        KeyWord: $.trim($("#txtkeyword").val()),
        OperModel: "adminapprove",
        Status: $(".selectStatus").val()
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
        html += "<tr><td><div class=\"over-txt-p\"><div title='" + data[i].appUserName + "' class=\"over-txt\">" + data[i].appUserName + "</div><div class=\"run-over\">...</div></div></td>";
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

        //html += "  <a class=\"operate-btn detail-btn\" title='查看详情' onclick=\"OpenDetail('" + data[i].applyID + "')\"></a>";
        html += "  <a class=\"operate-btn search1-btn\" title='审批进度' onclick=\"$(this).showapproveprogress('" + data[i].applyID + "');\"></a>";
        html += "  <a class=\"operate-btn approve-btn\" title='审批' onclick=\"OpenArovePage('" + data[i].applyID + "');\"></a>";
        html += "<input id=\"hidItemApplyId\" value='" + data[i].applyID + "' class=\"hidItemApplyId\" type=\"hidden\" /></td></tr>";
    }
    if ($.trim(html) != "") {
        $("#tbBodyContent").html(html);
    }
}
//查看详情
function OpenDetail(id) {
    window.open("/Office/officesettledaapplydetail.html?id=" + id);
}
//发布租赁申请
function OpenApply() {
    window.open("officesettledaapply.html");
}
//修改发布申请
function ModifyApply(id) {
    window.open("/Office/officesettledaapply.html?id=" + id);
}
//查询
function Search() {
    pageNo = 1;
    GetMyOfficeSettleApproveList();
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetMyOfficeSettleApproveList();
}
//打开审批页面
function OpenArovePage(id) {
    window.open("/Office/officesettledaapplyapprove.html?id=" + id);
}