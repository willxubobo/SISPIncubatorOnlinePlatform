$(function () {
    //初始化日历
    $('.calendar').mobiscroll().calendar({
        theme: 'mobiscroll',
        lang: 'zh',
        display: 'inline',
        dateFormat: 'mm/dd/yy',
        markedDisplay: 'bottom',
        layout: 'fixed',
        calendarWidth: '258',
        marked: [{
            d: '4/8',
            color: '#EBAE75'
        }, {
            d: '4/10',
            color: '#EBAE75'
        }, {
            d: '4/21',
            color: '#EBAE75'
        }, {
            d: '4/25',
            color: '#EBAE75'
        }, {
            d: '4/26',
            color: '#EBAE75'
        }],
        navigation: 'month',
        monthNames: ['. 01', '. 02', '. 03', '. 04', '. 05', '. 06', '. 07', '. 08', '. 09', '. 10', '. 11', '. 12']
    });
    GetAdvertisement();
    //添加链接地址
    //办公室入驻
    $(".divSection").find("li.thirdSection").click(function () {
        window.open("office/officesettledaapply.html");
    });
    //孵化器入驻
    $(".divSection").find("li.sixthSection").click(function () {
        window.open("Incubator/incubatorapply.html");
    });

    $(".divTopFlag").hide();
    var rightMargin = $(".search_resultDiv_Content").css("margin-right");
    var rightNum = parseFloat(rightMargin);
    var rightPositionNum = rightNum - 30 - 54;

    $(".divTopFlag").css("right", rightPositionNum);

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 100) {
            $('.divTopFlag').fadeIn(300);
        } else {
            $('.divTopFlag').fadeOut(300);
        }
    });
    $('.divTopFlag').click(function () {
        $('html,body').animate({ scrollTop: '0px' }, 800);
    });

    $(".txt_SearchInput").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            Search();
        }
    });
});


//点击孵化器，打开孵化器详情
function OpenIncubatorApply(id) {
    window.open("incubator/incubatorinfo.html?id=" + id);
}

function GetAdvertisement() {
    ///Type:home(首页),investment(投资机构),cooperation(业务合作),financing(融资项目),
    var ps = 100000;
    var searchObj = {
        PageSize: ps,
        PageNumber: 1,
        KeyWord: "",
        Type: "home"
    }
    var parameter = {
        requestUri: "/api/advertisements",
        requestParameters: searchObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               if (results) {
                   GetHtml(results);
               }
               InitPlug();
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}

//获取我的孵化器列表的html
function GetHtml(data) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {

        var url = data[i].url;
        if (data[i].picture != "") {
            url = data[i].picture;
        }

        //if ($.trim(url) != "") {
        //    htmlItem += "<li><a onclick=\"ShowInfo('" + data[i].url + "','" + data[i].adid + "')\" style='cursor: pointer' target=\"_blank\"><img src=\"" + url + "\" /></a></li>";
        //} else {
        //    htmlItem += "<li><a onclick=\"ShowInfo('" + data[i].url + "','" + data[i].adid + "')\" style='cursor: pointer' target=\"_blank\"><img src=\"images/pc/banner1.jpg\" /></a></li>";
        //}

        
        if ($.trim(url) != "") {
            htmlItem += "<li style='height:500px;cursor: pointer;background: url(" + url + ") center 0px no-repeat;' onclick=\"ShowInfo('" + data[i].url + "','" + data[i].adid + "')\"></li>";
        } else {
            htmlItem += "<li style='height:500px;cursor: pointer;background: url(images/pc/banner1.jpg) center 0px no-repeat;' onclick=\"ShowInfo('" + data[i].url + "','" + data[i].adid + "')\"></li>";
        }
    }
    if ($.trim(htmlItem) != "") {
        $(".ulAdvertisement").html(htmlItem);
    } else {
        $(".ulAdvertisement").html("<li><a  target=\"_blank\"><img src=\"images/pc/banner1.jpg\" /></a></li>");
    }

}

