$(window).load(function () { 
    $(".calendar").mobiscroll().calendar({
        theme: "mobiscroll",
        lang: "zh",
        display: "inline",
        controls: ["calendar"],
        showNow: "true",
        // layout: 'liquid',
        calendarWidth: "100%",
        buttons: ["now"],
        nowText: "今",
        markedText: true,
        onMonthLoaded: function (year, month, inst) {
            $(".curMonth").html(month+1);
            $(".curYear").html(year);
            markedDate(year, month);

        },
        onSetDate: function (day, inst) {
            ActivtyInformation(day, inst);
        },
        dateFormat: "yyyy-mm-dd",
        events: true,
        monthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    });
 
});


function markedDate(year, month) {
    ShowLoading();
    var curMonth = month+1;
    var curYear = year;
    var activityCalendar = {
        Year: curYear,
        Month: curMonth,
        Day:1
    };
    var formObj = {
        "activityCalendarDto": activityCalendar
    };
    var parameter = {
        requestUri: "/api/activitycalendar/datetime",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.dateList.length > 0) {
                var data = result.dateList;
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]).Format("yyyy-MM-dd");
                    $("div[data-full='" + date + "']").find(".dw-cal-day-fg").each(function () {
                        $(this).addClass("dw-cal-day-txt-c");
                    });
                }
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function ActivtyInformation(day, inst) {
    ShowLoading();
   
    var curYear = day.date.getFullYear();
    var dayDate = day.date.getDate();
    var curMonth = day.date.getMonth() + 1;
    var date = new Date(curYear + '/' + curMonth + '/' + dayDate).FormatCurrentMonth("yyyy-MM-dd");
    var activityCalendar = {
        dateTime: date
    };
    $(".eventsList").empty();
    var formObj = {
        "activityCalendarDto": activityCalendar
    };
    var parameter = {
        requestUri: "/api/activitycalendar/information",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.activityCalendarResponseList.length > 0) {
                var data = result.activityCalendarResponseList;
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].activityID;
                    var title = data[i].topic;
                    var category = data[i].category;
                    html += "<li>\
                            <a class='eventsLink' href='/Activity/activitydetail.html?id=" + id + "&&category=" + category + "'>\
                                <div class='eventsSteps'>" + curMonth + "." + dayDate + " " + title + "</div>\
                                <div class='linkMore'>\
                                </div>\
                            </a>\
                        </li>";
                }
                $(".eventsList").empty();
                $(".eventsList").append(html);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function OpenLayer() {
    $(".popupDiv").removeClass("hide");
}
//保存弹出层数据
function SaveOk() {
    var typeName = $(".projectType:checked").next().text();
    if ($.trim(typeName) == "活动发布申请") {
       window.location.href = "activitypublishapply.html";
    } else if ($.trim(typeName) == "举办孵化器活动申请") {
       window.location.href = "incubatoractivityapply.html";
    }
}
//关闭弹出层
function CloseLayer() {
    $(".popupDiv").addClass("hide");
}

function checkBtnSelect(obj) {
    $(obj).prev().prop("checked", "checked");
}