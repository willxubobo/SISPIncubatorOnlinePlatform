//获取系统消息
function GetSystemMsg() {
    var searchObj = {
        PageSize: 15,
        PageNumber: pageNo,
        MsgType: "0"
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
            GetMessageHtml(results);
            totalRecords = data.totalCount;
            pageinit(data.totalCount, "15", "div_pager");

            if (totalRecords == 0) {
                $("#divNodata").show();
            } else {
                $("#divNodata").hide();
            }
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//获取所有我接收的消息
function GetChartSendToMsg() {
    var searchObj = {
        PageSize: 15,
        PageNumber: pageNo,
        MsgType: "1"
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/messages/sendto",
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

            GetMessageHtml(results);

            totalRecords = data.totalCount;
            pageinit(data.totalCount, "15", "div_pager");

            if (totalRecords == 0) {
                $("#divNodata").show();
            } else {
                $("#divNodata").hide();
            }
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//获取所有我发送的消息
function GetChartSendFromMsg() {

    var searchObj = {
        PageSize: 15,
        PageNumber: pageNo,
        MsgType: "1"
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/messages/sendfrom",
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

            GetMessageHtml(results);

            totalRecords = data.totalCount;
            pageinit(data.totalCount, "15", "div_pager");

            if (totalRecords == 0) {
                $("#divNodata").show();
            } else {
                $("#divNodata").hide();
            }
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//加载系统信息html
function GetMessageHtml(results) {

    var className = "";
    var htmlItem = "";
    var tabon = $(".tab-title.on").attr("id");
    $("#tbBodyContent").empty();
    for (var i = 0; i < results.length; i++) {
        var status = results[i].status;
        if ($.trim(status) == "1") {
            className = 'read-color';
        } else {
            className = "";
        }
        var type = 'sendto';
        var chartHtem = "";
        if (tabon == "st") {
            htmlItem += "<tr class='" + className + "'><td>" + results[i].sendFromUserName + "</td>";
            type = 'sendto';
            chartHtem = "<a class=\"operate-btn chat-btn\" onclick=\"OpenSendMsgDialog('" + results[i].sendFrom + "','" + results[i].sendFromUserName + "')\" ></a>";
        } else if (tabon == "sf") {
            htmlItem += "<tr class='read-color'><td>" + results[i].sendToUserName + "</td>";
            type = 'sendfrom';
            chartHtem = "";
        } else if (tabon == "sys") {
            htmlItem += "<tr class='" + className + "'>";
            type = 'sysmsg';
            chartHtem = "";
        }

        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + results[i].content + "' class=\"over-txt\">" + results[i].content + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + results[i].created + "</td>";
        htmlItem += "<td><a class=\"operate-btn detail-btn\" onclick=\"ShowMessageDetail('" + results[i].messageID + "','" + type + "',this)\" title=\"查看详情\" href=\"#\"></a> " + chartHtem + " <a class=\"operate-btn remove-btn\" onclick=\"ShowDeleteItemConfirm('" + results[i].messageID + "')\" title='删除消息' href=\"#\"></a> <input id=\"hidMsgId\" value='" + results[i].messageID + "' class='hidMsgId' type=\"hidden\"/></td></tr>";
    }


    if ($.trim(htmlItem) != "") {
        if (tabon == "sys") {
            $("#tbBodyContentSys").html(htmlItem);

        } else {
            $("#tbBodyContent").html(htmlItem);
        }
    }
}

function pagePagination(p) {
    pageNo = p;
    var tabon = $(".tab-title.on").attr("id");
    if (tabon == "st") {
        GetChartSendToMsg();
    } else if (tabon == "sf") {
        GetChartSendFromMsg();
    } else if (tabon == "sys") {
        GetSystemMsg();
    }
}

$(function () {

    if (!CheckUserLogin()) return;

    GetChartSendToMsg();
});
//切换tab
function SwitchTab(obj) {
    pageNo = 1;
    $(obj).parent().find(".tab-title").removeClass("on");
    $(obj).addClass("on");
    var id = $(obj).attr("id");
    if (id == "st") {
        $("#ppTitle").show();
        $("#ppTitle").html("发送人");
        $("#allRead").show();

        $(".divSysmsg").hide();
        $(".divDialogmsg").show();

        GetChartSendToMsg();
    } else if (id == "sf") {
        $("#ppTitle").show();
        $("#ppTitle").html("接收人");
        $("#allRead").hide();

        $(".divSysmsg").hide();
        $(".divDialogmsg").show();

        GetChartSendFromMsg();
    } else if (id == "sys") {
        $(".divSysmsg").show();
        $(".divDialogmsg").hide();
        $("#allRead").show();
        GetSystemMsg();
    }
    ShowLoading();
}
//删除单项
function DeleteSystemMsg() {
    var id = $("#hidDeletemId").val();

    if ($.trim(id) == "") return;

    $(".hidMsgId").each(function () {
        if ($(this).val() == id) {
            $(this).parent().parent().remove();
        }
    });

    //$(obj).parent().parent().remove();

    var parameter = {
        requestUri: "/api/message/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/delete",
        data: jsonData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            HideDeleteItemConfirm();
            $(this).alert("删除成功");
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}

//批量更新已读
function UpdateMsgReadStatus() {

    if ($(".hidMsgId").length <= 0) {
        $(this).alert('没有数据进行更新');
        return;
    }

    var tabon = $(".tab-title.on").attr("id");
    if (tabon == "st") {
        UpdateChartMsgRead();
    } else if (tabon == "sf") {

    } else if (tabon == "sys") {
        UpdateAllMsgRead();
    }
}

//全部更新为已读
function UpdateAllMsgRead() {
    var messageObj = {
        Status: "test"
    };
    var msgArry = new Array();
    $(".hidMsgId").each(function () {
        var detail = {
            "MessageID": $(this).val()
        }
        msgArry.push(detail);
    });

    var formObj = {
        "Message": messageObj,
        listMsgs: msgArry
    };

    var parameter = {
        requestUri: "/api/message/allsys",
        requestParameters: formObj
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
            //$(".newsListBox").find(".newsTitleLink").addClass("read");
            $(this).alert('更新成功');
            $("#tbBodyContent").find("tr").addClass("read-color");
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//全部更新个人消息为已读
function UpdateChartMsgRead() {

    var type = "sendto";
    var msgArry = new Array();
    $(".hidMsgId").each(function () {
        var detail = {
            "MessageID": $(this).val()
        }
        msgArry.push(detail);
    });

    var searchObj = {
        SendToOrFrom: type,
        listMsgs: msgArry
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/message/uallperson",
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
            $(this).alert('更新成功');
            $("#tbBodyContent").find("tr").addClass("read-color");
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//批量删除
function DeleteMsg() {
    var tabon = $(".tab-title.on").attr("id");
    var type = "sendfrom";
    var msgLength = $(".hidMsgId").length;
    if (msgLength <= 0) {
        HideDeleteConfirm();
        $(this).alert("没有数据可进行删除，请检查");
        return;
    }
    if (tabon == "st") {
        type = "sendto";
        DeleteChartMsg(type);
    } else if (tabon == "sf") {
        DeleteChartMsg(type);
    } else if (tabon == "sys") {
        DeleteAllMsg();
    }
}
//清空所有系统消息
function DeleteAllMsg() {
    ShowLoading();
    var messageObj = {
        Status: "test"
    };
    var formObj = {
        "Message": messageObj
    };

    var parameter = {
        requestUri: "/api/message/allsys",
        requestParameters: formObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/delete",
        data: jsonData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            HideDeleteConfirm();
            HideLoading();
            $(this).alert('删除成功');
            $("#tbBodyContent").empty();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//清空个人消息
function DeleteChartMsg(type) {
    ShowLoading();

    $(".projectTabs").each(function () {
        var className = $(this).attr("class");
        if (className.indexOf("on") > 0) {
            if (className.indexOf("sendfrom") > 0) {
                type = "sendfrom";
            }
            if (className.indexOf("sendto") > 0) {
                type = "sendto";
            }
        }
    });

    var searchObj = {
        SendToOrFrom: type
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/message/allperson",
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
            HideDeleteConfirm();
            HideLoading();
            $(this).alert('删除成功');
            $("#tbBodyContent").empty();
            pageinit(0, "15", "div_pager");
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}

function ShowDeleteConfirm() {
    $(".divConfirm").show();
}

function HideDeleteConfirm() {
    $(".divConfirm").hide();
}

function ShowDeleteItemConfirm(id) {
    $("#hidDeletemId").val(id);
    $(".divDeleteItemConfirm").show();
}

function HideDeleteItemConfirm() {
    $("#hidDeletemId").val("");
    $(".divDeleteItemConfirm").hide();
}
//打开消息详情层
function ShowMessageDetail(id, type, obj) {
    $(".divMessageDetail").show();
    $("#hidMessageId").val(id);
    $("#hidMessageType").val(type);
    $(obj).parent().parent().addClass("read-color");
    GetMessageInfo();
}
//获取消息详情
function GetMessageInfo() {

    var msgType = $("#hidMessageType").val();
    var messageId = $("#hidMessageId").val();

    var parameter = {
        requestUri: "/api/message/" + messageId,
        requestParameters: messageId
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               //alert('1');
               var results = data.results;
               var html = "";
               if ($.trim(msgType) == "sysmsg") {
                   html = "<tr>";
                   html += "<td class=\"agreementTitle\" style='width:15%;'>消息内容：</td>";
                   html += "<td class=\"agreementTxt\" style='word-break: break-all;'>" + results[0].content + "</td></tr>";
               } else if ($.trim(msgType) == "sendto") {
                   html = "<tr><td class=\"agreementTitle\" style='width:15%;'>发送人：</td>";
                   html += "<td class=\"agreementTxt\">" + results[0].sendFromUserName + "</td></tr>";
                   html += "<tr><td class=\"agreementTitle\">消息内容：</td>";
                   html += "<td class=\"agreementTxt\" style='word-break: break-all;'>" + results[0].content + "</td><tr>";
               }
               else if ($.trim(msgType) == "sendfrom") {
                   html = "<tr><td class=\"agreementTitle\" style='width:15%;'>接收人：</td>";
                   html += "<td class=\"agreementTxt\">" + results[0].sendToUserName + "</td></tr>";
                   html += "<tr><td class=\"agreementTitle\">消息内容：</td>";
                   html += "<td class=\"agreementTxt\" style='word-break: break-all;'>" + results[0].content + "</td></tr>";
               }
               //$("#divTitle").html(results[0].title);
               $(".agreementContent").html(html);
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//关闭消息详情层
function CancelMessageDetail() {
    $("#hidMessageId").val("");
    $("#hidMessageType").val("");
    $(".divMessageDetail").hide();
    $(".agreementContent").empty();
}