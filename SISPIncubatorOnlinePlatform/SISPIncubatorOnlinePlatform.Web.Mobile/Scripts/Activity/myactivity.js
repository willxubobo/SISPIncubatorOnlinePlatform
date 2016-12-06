$(function () {
    CheckUserLogin();
    
    InitData(page);

});

var page = 0;

function InitData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page
        }
    var parameter = {
        requestUri: "/api/myactivity",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.results.length > 0) {
                GetHtml(result.results);
                CheckLoadMoreShowOrHide(result.results);
                Loadmobiscroll();
            } else {
                if (page == 0) {
                    nodata();
                } else {
                    $(".divLoadMore").hide();
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
//判断加载更多是否出现
function CheckLoadMoreShowOrHide(results) {
    if ($(".applicationList li").length < 10 || results.length <= 0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

function GetHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var id = data[i].activityId;
        var signUpID = data[i].signUpID;
        var topic = data[i].topic;
        var startDate = new Date(data[i].startTime.replace(/T/g, ' ').split(' ')[0]);
        var startYear = startDate.getFullYear();
        var startMonth = startDate.getMonth() + 2;
        var startDay = startDate.getDate();
        
        var endDate = new Date(data[i].endTime.replace(/T/g, ' ').split(' ')[0]);
        var endMonth = endDate.getMonth() + 2;
        var endYear = endDate.getFullYear();
        var endDay = endDate.getDate()+1;
        var startTime = new Date(startYear + '/' + startMonth + '/' + startDay).Format("yyyy-MM-dd");
        var endTime = new Date(endYear + '/' + endMonth + '/' + endDay);
        var category = data[i].category;
        var nowDate = new Date();
        html += "<li><a class='applicationLink' activityId=" + signUpID + " href='activitydetail.html?id=" + id + "&&category=" + category + "'>";
        if (nowDate <= endTime) {
            html += "<div class='applicationTitle'><span class=\"apTitle\">" + topic + "</span><span class=\"apDate\"> " + startTime + "</span></div>";
        } else {
            html += "<div class='applicationTitle expired'><span class=\"apTitle\">" + topic + "</span><span class=\"apDate\"> " + startTime + "</span></div>";
        }
        html += "<div class='PLMore'></div></a></li>";
        
    }
    $(".applicationList").append(html);
}

function Loadmobiscroll() {
    $('.applicationList').mobiscroll().listview({
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
                    var id = $($($(item)[0]).find(".applicationLink")[0]).attr("activityId");
                    DelMyActivity(id);
                    inst.remove(item);
                    if ($(".applicationTitle").length == 1)
                    {
                        $('.center').show();
                    }
                    return false;
                }
            }
        ]
    });
}

function ClickLoadMore() {
    page = page + 1;
    InitData(page);
}

function DelMyActivity(id) {
    var parameter = {
        requestUri: "/api/activitysignup/" + id,
        "requestParameters": {
        }
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/delete",
        data: parameterJson,
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

//暂无数据
function nodata() {
    $('.noRuseltCenter').show();
}