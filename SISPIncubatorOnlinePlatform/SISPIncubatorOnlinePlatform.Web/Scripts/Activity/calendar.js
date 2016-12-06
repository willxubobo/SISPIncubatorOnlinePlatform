$(window).load(function () {
    $(".calendar").mobiscroll().calendar({
        theme: "mobiscroll",
        lang: "zh",
        display: "inline",
        controls: ["calendar"],
        //showNow: "true",
        layout:'fixed',
        calendarWidth: "258",
        markedDisplay: 'bottom',
        navigation: 'month',
        onMonthLoaded: function (year, month, inst) {
            markedDate(year, month);

        },
        onSetDate: function (day, inst) {
            ActivtyInformation(day, inst);
        },
        dateFormat: "yyyy-mm-dd",
        events: true,
        monthNames: [". 01", ". 02", ". 03", ". 04", ". 05", ". 06", ". 07", ". 08", ". 09", ". 10", ". 11", ". 12"]
    });

});
function markedDate(year, month) {
    //ShowLoading();
    var curMonth = month + 1;
    var curYear = year;
    var activityCalendar = {
        Year: curYear,
        Month: curMonth,
        Day: 1
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
                var html = "<div class='dw-cal-day-m'>\
                                <div class='dw-cal-day-m-t'>\
                                    <div class='dw-cal-day-m-c' style='background:#4eccc4;'>\
                                    </div>\
                                </div>\
                            </div>";
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]).Format("yyyy-MM-dd");
                    $("div[data-full='" + date + "']").addClass("dw-cal-day-marked");
                    $("div[data-full='" + date + "']").find(".dw-cal-day-fg").each(function () {
                        $(this).after(html);
                        //$(this).addClass("dw-cal-day-txt-c");
                    });
                }
            }
            //HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            //HideLoading();
        }
    });
}

function ActivtyInformation(day, inst) {
    //ShowLoading();

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
    $(".arrow").hide();
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.activityCalendarResponseList.length > 0) {
                $(".div_NoEvents").hide();
                var data = result.activityCalendarResponseList;
                var html = "";
                if (data.length>3)
                {
                    $(".arrow").show();
                }
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].activityID;
                    var title = data[i].topic;
                    var category = data[i].category;
                    if (i % 3 == 0) {
                        html += "<ul>"
                    }
                    html += "<li>\
         				      <div class='divEventFlag'></div>\
         					  <div>" + curMonth + "." + dayDate + "</div>\
         					  <div class='clear'></div>\
         				  </li>\
         				  <li class='liEventTitle'><a style='color: #666;' href='/Activity/activitydetail.html?id=" + id + "&category=" + category + "' target='_blank'>" + title + "</a></li>";

                    if (i != data.length - 1&&i % 3 == 2) {

                        html += "<li><div class='divEventFlag'> <div class='clear'></div></div></ul>"
                    }
                    if (i == data.length - 1) {
                        html += "<li><div class='divEventFlag'> <div class='clear'></div></div></ul>"
                    }
                }
                $(".fourthSection").find(".bd").empty();
                $(".fourthSection").find(".bd").append(html);
                $(".div_event_Tab").slide();
            }
            else {
                $(".fourthSection").find(".bd").empty();
                $(".div_NoEvents").show();
            }
            //HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            //HideLoading();
        }
    });
}