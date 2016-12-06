$(function () {


    ShowLoading();

    CheckUserLogin();

    GetMessageInfo();
});

function GetMessageInfo() {
    var msgType = getUrlParam("type");
    var messageId = getUrlParam("id");

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
                   html = "";
                   html += "<div class=\"agreementTitle padding-space\">消息内容：</div>";
                   html += "<div class=\"agreementTxt\" style='word-break: break-all;'>" + ProcessWrap(results[0].content) + "</div>";
               } else if ($.trim(msgType) == "sendto") {
                   html = "<div class=\"agreementTitle padding-space\">发送人：</div>";
                   html += "<div class=\"agreementTxt\">" + results[0].sendFromUserName + "</div>";
                   html += "<div class=\"agreementTitle padding-space\">消息内容：</div>";
                   html += "<div class=\"agreementTxt\" style='word-break: break-all;'>" + ProcessWrap(results[0].content) + "</div>";
               }
               else if ($.trim(msgType) == "sendfrom") {
                   html = "<div class=\"agreementTitle padding-space\">接收人：</div>";
                   html += "<div class=\"agreementTxt\">" + results[0].sendToUserName + "</div>";
                   html += "<div class=\"agreementTitle padding-space\">消息内容：</div>";
                   html += "<div class=\"agreementTxt\" style='word-break: break-all;'>" + ProcessWrap(results[0].content) + "</div>";
               }
               $("#divTitle").html(results[0].title);
               $(".agreementContent").html(html);
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
