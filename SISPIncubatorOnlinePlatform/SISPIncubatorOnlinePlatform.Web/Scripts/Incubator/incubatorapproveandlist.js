
$(function () {
    if (!CheckUserLogin()) return;

    $(".selectStatus").select2({
        minimumResultsForSearch: Infinity
    });


    $('.selectStatus').change(function () {
        pageNo = 1;
        GetIncubatorApplyData();
    });

    GetIncubatorApplyData();

    InitEventByKeyUp();
});


function InitEventByKeyUp() {
    $("#txtkeyword").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            SearchKey();
        }
    });
}

//获取后台数据
function GetIncubatorApplyData() {
    var ps = 10;

    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        IncubatorTypeRole: "incubatoradmin",
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
//点击分页
function pagePagination(p) {
    pageNo = p;
    GetIncubatorApplyData();
}
//得到孵化器入驻列表的html
function GetIncubatorApplyHtml(data) {
    var html = "";
    $("#tbBodyContent").empty();
    for (i = 0; i < data.length; i++) {
        html += "<tr><td>" + data[i].appUserName + "</td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].projectName + "' class=\"over-txt\">" + data[i].projectName + "</div><div class=\"run-over\">...</div></div></td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].projectOwner + "' class=\"over-txt\">" + data[i].projectOwner + "</div><div class=\"run-over\">...</div></div></td>";
        html += "<td><div class=\"over-txt-p\"><div title='" + data[i].incubatorName + "' class=\"over-txt\">" + data[i].incubatorName + "</div><div class=\"run-over\">...</div></div></td>";
        html += "<td>" + data[i].appDate + "</td>";
        var sppstatushtml = data[i].applyStatusDes;
        var btnHtml = "<a class=\"operate-btn detail-btn\" onclick=\"OpenDetailPage('"  + data[i].applyID +"' )\" title='查看详情' ></a>";
        if (data[i].applyStatus == "1") {
            sppstatushtml = "<p class=\"yellow-color\">" + data[i].applyStatusDes + "</p>";
            btnHtml += "<a class=\"operate-btn approve-btn\" title='审批' onclick=\"OpenApprovePage('" + data[i].applyID + "')\" ></a>";
        } else if (data[i].applyStatus == "2") {
            sppstatushtml = "<p class=\"green-color\">" + data[i].applyStatusDes + "</p>";
            btnHtml += "<a class=\"operate-btn approve-btn\" title='审批' onclick=\"OpenApprovePage('" + data[i].applyID + "')\" ></a>";
        }
        else if (data[i].applyStatus == "4") {
            sppstatushtml = "<p class=\"red-color\">" + data[i].applyStatusDes + "</p>";
            btnHtml += "<a class=\"operate-btn upload-btn\" title='上传协议' onclick=\"OpenUploadPage('" + data[i].applyID + "')\" ></a>";
        }
        html += "<td>" + sppstatushtml + "</td>";
        html += "<td>" + btnHtml + "</td></tr>";
    }
    $("#tbBodyContent").append(html);
}
//打开审批页面
function OpenApprovePage(id) {
    window.open("incubatorapprove.html?id=" + id);
}
//打开审批页面
function OpenUploadPage(id) {
    window.open("incubatorupload.html?id=" + id);
}
//打开详情页面
function OpenDetailPage(id) {
    window.open("incubatorapplydetail.html?id=" + id + "&src=todo");
}
//查询
function SearchKey() {
    pageNo = 1;
    GetIncubatorApplyData();
}



