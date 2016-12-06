//打开发送消息窗口
function OpenSendMsgDialog(userId, userName) {
    if (CheckUserLogin()) {
        $(".msgDialog").show();
        $("#divSendToName").html(userName);
        $("#hidSendToUserId").val(userId);
        $("body").css("overflow", "hidden");
    }
}
//关闭发送消息窗口
function CloseSendMsgDialog() {
    $("#divSendToName").html("");
    $("#txtSendContent").val("");
    $("#txtSendContent").next().hide();
    $("#hidSendToUserId").val("");
    $(".msgDialog").hide();
    $("body").css("overflow", "auto");
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
$(function () {
    var chartDialog = "";
    chartDialog += "<div class=\"popup-div hide msgDialog\">";
    chartDialog += "<div class=\"popup-bg\"></div>";
    chartDialog += "<div class=\"popup-content center\" style=\"width: 625px;\">";
    chartDialog += "<div class=\"popup-main-content padding20 white-bg\">";
    chartDialog += "	<div class=\"edit-activity-box\">";
    chartDialog += "     <div class=\"officeTime\">接收人</div><div id=\"divSendToName\" style=\"margin-bottom: 10px;\"></div>";
    chartDialog += "	<textarea class=\"textarea-enter\" id=\"txtSendContent\" onblur=\"CheckMsgContent($(this))\" style=\"height: 170px;\" placeholder=\"限字数100字内！\"></textarea><div class=\"failInfo hide\">发送内容不能为空！</div>";
    chartDialog += "</div>";
    chartDialog += "<div class=\"btn-box padding45\">";
    chartDialog += "	<a class=\"base-btn sm-btn bule-btn space25\" onclick=\"SendMsg();\" href=\"javascript:;\">确定</a>";
    chartDialog += "		<a class=\"base-btn sm-btn space25\" onclick=\"CloseSendMsgDialog();\" href=\"javascript:;\">取消</a>";
    chartDialog += "         <input id=\"hidSendToUserId\" type=\"hidden\" />";
    chartDialog += "			</div>";
    chartDialog += "		</div>";
    chartDialog += "	</div>";
    chartDialog += "</div>";
    if ($("body").find(".msgDialog").length == 0) {
        $('body').append(chartDialog);
    }

    popup();
});