//打开发送消息窗口
function OpenSendMsgDialog(userId, userName) {
    $(".popupDiv").removeClass("hide");
    $("#divSendToName").html(userName);
    $("#hidSendToUserId").val(userId);
}
//关闭发送消息窗口
function CloseSendMsgDialog() {
    $("#divSendToName").html("");
    $("#txtSendContent").val("");
    $("#hidSendToUserId").val("");
    $(".popupDiv").addClass("hide");
}
//发送功能
function SendMsg() {

    if (CheckMsgValidation()) return;

    ShowLoading();
    var messageObj = {
        Title: $("#txtTitle").val(),
        Content: $("#txtSendContent").val(),
        MsgType: "1",
        SendTo: $("#hidSendToUserId").val()

    }
    var formObj = {
        "Message": messageObj
    };

    var parameter = {
        requestUri: "/api/message",
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
            CloseSendMsgDialog();
            $(this).alert("发送成功");
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//失去焦点触发
function CheckMsgContent(obj) {
    if ($.trim(obj.val()) == "") {
        obj.next().show();
    } else {
        obj.next().hide();
    }
}
//验证发送的内容
function CheckMsgValidation() {

    var content = $("#txtSendContent").val();

    var b = false;
    
    if ($.trim(content) == "") {
        $("#txtSendContent").next().show();
        b = true;
    } else {
        $("#txtSendContent").next().hide();
        b = false;
    }
    return b;
}
//初始化发送的html;
$(function() {
    var chartDialog = "";
    chartDialog += "<div class=\"popupDiv hide msgDialog\"><div class=\"center\" style=\"width: 300px; height: auto;\">";
    chartDialog += "<div class=\"popupBox padding20\"><div class=\"officeTimeBox\"><div class=\"officeTime\">接收人</div><div id=\"divSendToName\" style=\"margin-bottom: 10px;\"></div>";
   
    chartDialog += " <div class=\"officeTime\">内容</div><div class=\"officeDiv\" style=\"height: auto;\">";
    chartDialog += " <textarea class=\"enterIpt\" id=\"txtSendContent\" onblur=\"CheckMsgContent($(this))\" placeholder=\"发送内容\" maxlength=\"100\" style=\"height: 80px;\"></textarea><div class=\"failInfo hide\">发送内容不能为空！</div>";
    chartDialog += "</div></div><div class=\"quitBtnBox\"><button class=\"baseBtn registerBtn blueBtn left\" onclick=\"SendMsg();\" type=\"button\">发送</button>";
    chartDialog += " <button class=\"baseBtn registerBtn darkBlueBtn right\" onclick=\"CloseSendMsgDialog();\" type=\"button\">取消</button><input id=\"hidSendToUserId\" type=\"hidden\" /></div></div></div></div>";
    if ($("body").find(".msgDialog").length == 0) {
        $('body').append(chartDialog);
    }
});