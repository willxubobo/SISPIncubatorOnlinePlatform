//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");


$(function () {
    //if (!CheckUserLogin())return;
    CheckUserLogin();
    ShowLoading();
    GetData();

    $("body").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            CancelMessageDetail();
        }
    });
});

function GetData() {

    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: "",
        MsgType: "admin"
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/messages",
        requestParameters: searchObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               if (results) {
                   GetHtml(results);

                   totalRecords = data.totalCount;
                   pageinit(data.totalCount, ps, "divpager");

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
//获取我的消息列表的html
function GetHtml(data) {

    $("#tbBodyContent").empty();

    var htmlItem = "";

    for (i = 0; i < data.length; i++) {

        htmlItem += "<tr><td><input class=\"base-checkbox chkItem\" value='" + data[i].messageID + "' onclick='ChkItem()' type=\"checkbox\"></td>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].content + "' class=\"over-txt\">" + data[i].content + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + data[i].sendFromUserName + "</td>";
        htmlItem += "<td>" + data[i].created + "</td>";
        htmlItem += "<td><a class=\"operate-btn detail-btn\" onclick=\"OpenDetail(this)\" title=\"查看详情\" href=\"#\"></a> ";
        htmlItem += "  <a class=\"operate-btn remove-btn\" title='删除' onclick=\"DeleteMsgById('" + data[i].messageID + "');\"></a></td></tr>";
    }
    if ($.trim(htmlItem) != "") {
        $("#tbBodyContent").html(htmlItem);
    }

}

function OpenMessageInfo(id) {
    window.open('incubatorinfo.html?id=' + id);
}

function SearchByKeys() {
    $('#tbBodyContent').html("");
    pageNo = 1;
    GetData();
}
//分页
function pagePagination(p) {
    pageNo = p;
    GetData();
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
//打开撤销确认对话框
function OpenConfirm() {
    $(".divConfirm").show();
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidIds").val("");
}
//删除单项
function DeleteMsgById(id) {
    $("#hidIds").val(id);
    OpenConfirm();
}
//删除消息
function DeleteMsg() {

    var searchObj = {
        DeleteIds: $("#hidIds").val()
    }

    var parameter = {
        requestUri: "/api/messages/admin",
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
                   GetData();
               }, 2000);

           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//删除多个
function DeleteMsgSelect() {

    if ($(".chkItem:checked").length <= 0) {
        $(this).alert('请选择需要删除的项目！');
        return;
    }

    var allIds = "";
    $(".chkItem:checked").each(function () {
        var id = $(this).val();
        allIds = allIds + "|" + id;
    });
    $("#hidIds").val(allIds);
    OpenConfirm();
}
//关闭消息详情层
function CancelMessageDetail() {
    $(".divMessageDetail").hide();
    $(".agreementContent").empty();
}
//打开详情
function OpenDetail(obj) {
    var name = $(obj).parent().parent().find("td:eq(2)").html();
    var content = $(obj).parent().parent().find(".over-txt").attr("title");
    var html = "<tr><td class=\"agreementTitle\" style='width:15%;'>发送人：</td><td class=\"agreementTxt\">" + name + "</td></tr>";
    html += "<tr><td class=\"agreementTitle\">消息内容：</td>";
    html += "<td class=\"agreementTxt\" style='word-break: break-all;'>" + content + "</td></tr>";
    $(".agreementContent").html(html);
    $(".divMessageDetail").show();
}