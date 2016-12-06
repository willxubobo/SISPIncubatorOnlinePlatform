$(function () {


    ShowLoading();

    CheckUserLogin();

    InitListView();

    GetSystemMsg();

    GetChartSendToMsg();

    GetChartSendFromMsg();

    IncubatorTabs();

});

var isAllComplete = 0;
function CheckIsCompleteData() {
    if (isAllComplete >= 3) {
        HideLoading();
    }
}

//获取系统消息
var page = 1;
var pagesendto = 1;
var pagefrom = 1;
//获取系统消息
function GetSystemMsg() {
    var searchObj = {
        PageSize: "20",
        PageNumber: page,
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

            isAllComplete = isAllComplete + 1;

            var results = data.results;
            GetSysHtml(results);

            CheckMoreShowOrHide(results);
            InitListView();
            //判断后台数据是否加载完成
            CheckIsCompleteData();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//获取所有发送给登陆人的消息
function GetChartSendToMsg() {
    var searchObj = {
        PageSize: "20",
        PageNumber: pagesendto,
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
            isAllComplete = isAllComplete + 1;

            var results = data.results;

            GetSendToHtml(results);
            CheckChartSendToShowOrHide(data);
            InitListView();

            //判断后台数据是否加载完成
            CheckIsCompleteData();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//获取所有登陆人的消息
function GetChartSendFromMsg() {
    var searchObj = {
        PageSize: "20",
        PageNumber: pagefrom,
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
            //alert('1');
            isAllComplete = isAllComplete + 1;
            var results = data.results;

            GetSendFromHtml(results);

            CheckChartSendFromShowOrHide(data);
            InitListView();

            CheckIsCompleteData();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}

function GetSysHtml(results) {
    var html = "";
    var className = "";
    for (var i = 0; i < results.length; i++) {
        var status = results[i].status;
        if ($.trim(status) == "1") {
            className = 'read';
        } else {
            className = "";
        }
        var oldContent = results[i].content;
        var newContent = oldContent.length > 50 ? oldContent.substring(0,50) + "..." : results[i].content;
        html += "<li><div class=\"newsTitleTxt\">";
        html += "<a class=\"newsTitleLink " + className + "\" onclick=\"ShowInfo(this,'" + results[i].messageID + "','sysmsg');\" alt=\"" + oldContent + "\" href=\"#\">" + newContent + "</a>" +
            " <input id='hdMsgId' class='hidSysMsgId " + className + "' value='" + results[i].messageID + "' type=\"hidden\" /> <input id='hidMsgSendFromName' value='" + results[i].sendFromUserName + "' type=\"hidden\" /></div></li>";
    }
    if (results.length == 0&&page==1) {
        $("#divSysMsg").show();
    } else {
        $("#divSysMsg").hide();
    }

    $(".systemMsg").append(html);
}

function GetSendToHtml(results) {
    var html = "";
    var className = "";
    for (var i = 0; i < results.length; i++) {
        var status = results[i].status;
        if ($.trim(status) == "1") {
            className = 'read';
        } else {
            className = "";
        }
        html += "<li> <a class=\"chatNewsLink \" onclick=\"ShowInfo(this,'" + results[i].messageID + "','sendto');\" href=\"#\"><div class=\"chatNewsPic\">";
        html += "<img src='" + results[i].headimgurl + "'></div>";
        html += "<div class=\"chatNewsTitleBox\"><p class=\"chatNewsTitleTxt " + className + "\" style='width:75%;' >" + results[i].content + "</p>";
        html += " <p class=\"chatNewsContent " + className + "\">" + results[i].content + "</p></div>";
        html += " <div class=\"chatDate\">" + results[i].created + "</div><input id='hidMsgSendFromName' value='" + results[i].sendFromUserName + "' type=\"hidden\" /></a><input id='hdMsgId' class='hidSendToMsgId " + className + "' value='" + results[i].messageID + "' type=\"hidden\" /></li>";
    }
    if (results.length == 0&&pagesendto==1) {
        $("#divSendto").show();
    } else {
        $("#divSendto").hide();
    }
    $(".chartListSendTo").append(html);
}

function GetSendFromHtml(results) {
    var html = "";
    var className = "read";
    for (var i = 0; i < results.length; i++) {

        html += "<li> <a class=\"chatNewsLink \" onclick=\"ShowInfo(this,'" + results[i].messageID + "','sendfrom');\" href=\"#\"><div class=\"chatNewsPic\">";
        html += "<img src='" + results[i].headimgurl + "'></div>";
        html += "<div class=\"chatNewsTitleBox\"><p class=\"chatNewsTitleTxt " + className + "\" style='width:75%;'>" + results[i].content + "</p>";
        html += " <p class=\"chatNewsContent " + className + "\">" + results[i].content + "</p></div>";
        html += " <div class=\"chatDate\">" + results[i].created + "</div><input id='hidMsgSendFromName' value='" + results[i].sendToUserName + "' type=\"hidden\" /></a><input id='hdMsgId' value='" + results[i].messageID + "' type=\"hidden\" /></li>";
    }
    if (results.length == 0&&pagefrom==1) {
        $("#divSendfrom").show();
    } else {
        $("#divSendfrom").hide();
    }
    $(".chartListSendfrom").append(html);
}

//加载更多系统消息
function ClickLoadMore() {
    page = page + 1;
    GetSystemMsg();
}

function CheckMoreShowOrHide(data) {
    if (data.length <= 0 || $(".systemMsg li").length < 20) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

function ClickLoadMoreChartSendFrom() {
    pagefrom = pagefrom + 1;
    GetChartSendFromMsg();
}

function CheckChartSendFromShowOrHide(data) {
    if (data.length <= 0 || $(".chartListSendfrom li").length < 20) {
        $(".divChartSendfromLoadMore").hide();
    } else {
        $(".divChartSendfromLoadMore").show();
    }
}

function ClickLoadMoreChartSendTo() {
    pagesendto = pagesendto + 1;
    GetChartSendToMsg();
}

function CheckChartSendToShowOrHide(data) {
    if (data.length <= 0 || $(".chartListSendTo li").length < 20) {
        $(".divChartSendtoLoadMore").hide();
    } else {
        $(".divChartSendtoLoadMore").show();
    }
}
//删除单项
function DeleteSystemMsg(id) {
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
            if ($(".newsScrollList li").length < 20) {
                //$(".divLoadMore").hide();
                if ($(".newsScrollList li").length == 0) {
                    $("#divSysMsg").show();
                }
            } else {
               // $(".divLoadMore").show();
            }
            if ($(".chartListSendfrom li").length < 20) {
                //$(".divChartSendfromLoadMore").hide();
                if ($(".chartListSendfrom li").length == 0) {
                    $("#divSendfrom").show();
                }
            } else {
                //$(".divChartSendfromLoadMore").show();
            }
            if ($(".chartListSendTo li").length < 20) {
                //$(".divChartSendtoLoadMore").hide();
                if ($(".chartListSendTo li").length == 0) {
                    $("#divSendto").show();
                }
            } else {
                //$(".divChartSendtoLoadMore").show();
            }
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//全部更新为已读
function UpdateAllMsgRead() {
    if ($(".hidSysMsgId").length <= 0) {
        $(this).alert("没有数据可进行更新");
        return;
    }

    var messageObj = {
        Status: "test"
    };
    var msgArry=new Array();
    $(".hidSysMsgId:not('.read')").each(function () {
        var detail = {
            "MessageID": $(this).val()
        }
        msgArry.push(detail);
    });

    var formObj = {
        Message: messageObj,
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
            $(".newsListBox").find(".newsTitleLink").addClass("read");
            $(this).alert("更新完成");
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
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
            HideConfirm();
            
            $(".newsListBox").empty();
            if ($(".newsListBox li").length < 20) {
                $(".divLoadMore").hide();
                if ($(".newsListBox li").length == 0) {
                    $("#divSysMsg").show();
                }
            } else {
                $(".divLoadMore").show();
            }
            HideLoading();
            $(this).alert('清空成功');
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//清空个人消息
function DeleteChartMsg() {
    ShowLoading();
    var type = "sendfrom";
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
            HideConfirm();

            if (type == "sendfrom") {

                $(".chartListSendfrom").empty();
                if ($(".chartListSendfrom li").length < 20) {
                    $(".divChartSendfromLoadMore").hide();
                    if ($(".newsListBox li").length == 0) {
                        $("#divSendfrom").show();
                    }
                } else {
                    $(".divChartSendfromLoadMore").show();
                }
            }
            if (type == "sendto") {
                $(".chartListSendTo").empty();
                if ($(".chartListSendTo li").length < 20) {
                    $(".divChartSendtoLoadMore").hide();
                    if ($(".newsListBox li").length == 0) {
                        $("#divSendto").show();
                    }
                } else {
                    $(".divChartSendtoLoadMore").show();
                }
            }
            HideLoading();
            $(this).alert('清空成功');
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//全部更新个人消息为已读
function UpdateChartMsgRead() {

    if ($(".hidSendToMsgId").length <= 0) {
        $(this).alert("没有数据可进行更新");
        return;
    }

    var type = "sendfrom";
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
    var msgArry=new Array();
    $(".hidSendToMsgId:not('.read')").each(function () {
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
            if (type == "sendfrom") {
                $(".chartListSendfrom").find("p.chatNewsLink").addClass("read");
            }
            if (type == "sendto") {
                $(".chartListSendTo").find("p.chatNewsTitleTxt").addClass("read");
                $(".chartListSendTo").find("p.chatNewsContent").addClass("read");
                $(".chartListSendTo").find("a.chatNewsLink").addClass("read");
            }
            $(this).alert("更新完成");
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}


function InitListView() {
    $('.chatList').mobiscroll().listview({
        theme: 'mobiscroll',
        lang: 'zh',
        // sortable: true,
        // iconSlide: true,
        // altRow: true,
        stages: [
            {
                percent: -25,
                color: 'red',
                text: '删除',
                confirm: true,
                action: function (item, inst, index) {
                    inst.remove(item);
                    var id = $(item).find("#hdMsgId").val();
                    DeleteSystemMsg(id);
                    return false;
                }
            }
        ]
    });
    $('.newsListBox').mobiscroll().listview({
        theme: 'mobiscroll',
        lang: 'zh',
        // sortable: true,
        // iconSlide: true,
        // altRow: true,
        stages: [
            {
                percent: -25,
                color: 'red',
                text: '删除',
                confirm: true,
                action: function (item, inst, index) {
                    inst.remove(item);
                    var id = $(item).find("#hdMsgId").val();
                    DeleteSystemMsg(id);
                    return false;
                }
            }
        ]
    });
}

function IncubatorTabs() {
    $(".infoTitle:first").addClass("curTitle");
    $(".businessTxtBox>div").not(":first").hide();
    $(".infoTitle>div").click(function () {
        $(this).parent().addClass("curTitle").siblings().removeClass("curTitle");
        var index = $(".infoTitle>div").index(this);
        $(".businessTxtBox>div").eq(index).fadeIn(400).siblings().hide();
    });

    $(".projectInfoTabs>.projectTabs:first").addClass("on");
    $(".projectBox>.projectBoxContent").not(":first").hide();
    $(".projectInfoTabs>.projectTabs").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var index = $(".projectInfoTabs>.projectTabs").index(this);
        $(".projectBox>.projectBoxContent").eq(index).fadeIn(400).siblings().hide();
    });
};

function ShowInfo(obj, id, type) {
    var sendfromName = "";
    var content = "";
    if (type == "sysmsg") {
        $(obj).addClass("read");
        sendfromName = $(obj).parent().find("#hidMsgSendFromName").val();
        content = $(obj).text();
    } else {
        $(obj).find("p.chatNewsTitleTxt").addClass("read");
        $(obj).find("p.chatNewsContent").addClass("read");

        sendfromName = $(obj).find("#hidMsgSendFromName").val();
        content = $(obj).find(".chatNewsContent").text();
    }
    $("#divSendToName").html(sendfromName);
    $("#divMsgLayerConent").html(content);
    //$(".msgDialog").removeClass("hide");

   window.location.href = "messagecenterinfo.html?id=" + id + "&type=" + type;
}

function CancelInfo() {
    $("#divSendToName").html("");
    $("#divMsgLayerConent").html("");
    $(".msgDialog").addClass("hide");
}
//显示确认框
function ShowConfirm(type) {
    $(".divConfirm").removeClass("hide");
    if (type == "0") {
        if ($(".newsListBox li").length == 0) {
            $(".divConfirm").addClass("hide");
            $(this).alert("没有数据可以进行清空");
        } else {
            $(".divConfirm").removeClass("hide");
            $("#btnOkDeleteSys").show();
            $("#btnOkDelete").hide();
        }
    } else {
        var type = "sendfrom";
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
        if (type == "sendfrom") {
            if ($(".chartListSendfrom li").length == 0) {
                $(this).alert("没有数据可以进行清空");
                $(".divConfirm").addClass("hide");
            } else {
                $(".divConfirm").removeClass("hide");
                $("#btnOkDeleteSys").hide();
                $("#btnOkDelete").show();
            }
        }
        if (type == "sendto") {
            if ($(".chartListSendTo li").length == 0) {
                $(this).alert("没有数据可以进行清空");
                $(".divConfirm").addClass("hide");
            } else {
                $(".divConfirm").removeClass("hide");
                $("#btnOkDeleteSys").hide();
                $("#btnOkDelete").show();
            }
        }
    }
}
//取消确认框
function HideConfirm() {
    $(".divConfirm").addClass("hide");
}
//每3分钟更新一次
var timeX = 1000 * 60 * 3;
function AutoTimer() {
    $(".newsListBox").empty();
    $(".chartListSendfrom").empty();
    $(".chartListSendTo").empty();

    $("#divSendfrom").hide();
    $("#divSendto").hide();
    $("#divSysMsg").hide();

    page = 1;
    pagesendto = 1;
    pagefrom = 1;

    GetSystemMsg();

    GetChartSendToMsg();

    GetChartSendFromMsg();
}

setInterval("AutoTimer()", timeX);//1000为1秒钟,设置为1分钟。  